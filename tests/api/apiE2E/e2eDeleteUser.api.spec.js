import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { authenticate } from "../utils/functions/apiAuthFunction";
import { createCommentFunc, contentVariables, createReplyFunc } from "../utils/functions/commentFunctions";
import { createEmptyPostMutation, updatePostMutation } from "../apiRegression/apiPosts/postMutation";
import { createMessageMutation } from "../apiRegression/apiChat/chatMutations";
import { createComplaintMutation } from "../apiRegression/apiComplaint/complaintMutations";
import { createReviewMutation } from "../apiRegression/apiReview/reviewMutations";
import { deleteUserMutation } from "../apiRegression/apiUser/userMutations";
import { getCurrentUserPostsQuery, fetchPostsWithCommentsQuery, getLatestPostsQuery } from "../apiRegression/apiPosts/postQueries";
import { getComments, getUserProfileCommentsQuery } from "../apiRegression/apiComments/commentQueries";
import { complaintsListQuery } from "../apiRegression/apiComplaint/complaintQueries";
import { getBetReviewQuery } from "../apiRegression/apiReview/reviewQueries";
import { matchesUpcomingQuery } from "../apiRegression/apiMatch/matchQueries";
import { getChatroomByEntityIDQuery, getMessageHistoryQuery } from "../apiRegression/apiChat/chatQueries";
import { userForDeleteInfo, user2ForDeleteInfo, user3ForDeleteInfo, adminUserInfo, secondUserInfo } from "../utils/apiVariables";

const apiURL = process.env.API_URL;

if (apiURL?.includes("by")) {
    test.describe.skip("E2E test: User deletion and removal of their traces on the platform", () => { });
} else {
    test.describe.serial("E2E test: User deletion and removal of their traces on the platform", () => {
        let headers;
        let adminHeaders;
        let createdPostId;
        let chatId;
        let messageId;
        let postWithCommentsId;
        let commentToReport;
        let createdReviewId;
        let lastCreatedCommentId;
        let adminCommentId;
        let userId;
        let adminUserId;

        let language = "en";
        if (apiURL?.includes("ua.")) {
            language = "uk";
        }

        test.beforeAll(async ({ request }) => {
            const usersToTry = [userForDeleteInfo, user2ForDeleteInfo, user3ForDeleteInfo, secondUserInfo];
            let userAuth;

            for (const user of usersToTry) {
                try {
                    userAuth = await authenticate(request, user.email, user.password);
                    break;
                } catch (error) {
                    const isDeletedUser =
                        error?.response?.errors?.[0]?.extensions?.statusString === "UNAUTHENTICATED" ||
                        error?.message?.includes("UNAUTHENTICATED");

                    if (isDeletedUser) {
                        console.log(`User ${user.email} is deleted. Trying next...`);
                        continue;
                    }
                    throw error;
                }
            }

            if (!userAuth) throw new Error("All users for deletion are unavailable.");

            headers = { "X-Auth-Token": userAuth["X-Auth-Token"], "X-language": language };
            userId = userAuth.userId;

            const adminAuth = await authenticate(request, adminUserInfo.email, adminUserInfo.password);
            adminHeaders = { "X-Auth-Token": adminAuth["X-Auth-Token"], "X-language": language };
            adminUserId = adminAuth.userId;
        });

        test("User creates and publishes a post", async ({ request }, testInfo) => {
            const createPostResponse = await request.post(apiURL, {
                data: { query: createEmptyPostMutation },
                headers
            });

            const createPostResponseBody = await createPostResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: createPostResponseBody
            });

            createdPostId = createPostResponseBody.data.postMutations.createEmpty;
            expect(createdPostId).toBeDefined();

            const structuredBody = JSON.stringify([
                {
                    type: "paragraph",
                    value: {
                        elements: [
                            {
                                type: "text",
                                value: {
                                    text: "This is a simple post content.",
                                },
                            },
                        ],
                        size: "regular",
                    },
                },
            ]);

            const updateVariables = {
                post: {
                    id: createdPostId,
                    title: { [language]: "Post Title" },
                    structuredBody: { [language]: structuredBody },
                    status: "PUBLISHED",
                    languages: [language.toUpperCase()],
                    mainSport: "FOOTBALL"
                }
            };

            await request.post(apiURL, {
                data: { query: updatePostMutation, variables: updateVariables },
                headers,
            });

            await expect.poll(async () => {
                const getPostsResponse = await request.post(apiURL, {
                    data: { query: getCurrentUserPostsQuery },
                    headers,
                });

                const postsResponseBody = await getPostsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: postsResponseBody
                });

                const userPosts = postsResponseBody.data.postQueries.currentUserFeed.items;
                const foundPost = userPosts.find((post) => post.id === createdPostId);

                return foundPost?.title?.defaultValue === "Post Title";
            }, { timeout: 100000, intervals: [5000] }).toBe(true);

            await expect.poll(async () => {
                const feedResponse = await request.post(apiURL, {
                    data: { query: getLatestPostsQuery },
                    headers,
                });

                const feedResponseBody = await feedResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: feedResponseBody
                });

                const posts = feedResponseBody.data.postQueries.feed.items;

                return posts.some((post) => post.id === createdPostId);
            }, { timeout: 100000, intervals: [5000] }).toBe(true);
        });

        test("User creates and verifies a review on Bookmaker", async ({ request }, testInfo) => {
            const reviewHeaders = {
                ...headers,
                "x-country-code": "ua",
                "x-geoip2-city-country-code": "ukr",
            };

            const reviewVariables = {
                score: 4,
                text: "a decent bookmaker with a wide range of betting options and a user-friendly app. The odds are average, but withdrawals are fast. Bonuses are attractive, though the wagering requirements are quite strict.",
                betPlatformType: "BOOKMAKER",
                entityID: "698f3f1ad488601284a5acec",
            };

            const reviewResponse = await request.post(apiURL, {
                data: { query: createReviewMutation, variables: reviewVariables },
                headers: reviewHeaders,
            });

            const reviewResponseBody = await reviewResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: reviewResponseBody
            });

            createdReviewId = reviewResponseBody.data.platformMutations.betReviewMutations.createReview.id;
            expect(createdReviewId).toBeDefined();

            await expect.poll(async () => {
                const reviewsResponse = await request.post(apiURL, {
                    data: {
                        query: getBetReviewQuery,
                        variables: { reviewID: createdReviewId },
                    },
                    headers: reviewHeaders,
                });

                const reviewsResponseBody = await reviewsResponse.json();

                const review =
                    reviewsResponseBody?.data?.platformQueries?.betReviewQueries?.getBetReview;

                return review?.id === createdReviewId;
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("User sends a message in match chat", async ({ request }, testInfo) => {
            const matchResponse = await request.post(apiURL, {
                data: { query: matchesUpcomingQuery },
                headers,
            });

            const matchResponseBody = await matchResponse.json();
            const matchId = matchResponseBody.data.stat_matchesUpcoming.matches[0]?.id;
            expect(matchId).toBeDefined();

            const chatResponse = await request.post(apiURL, {
                data: {
                    query: getChatroomByEntityIDQuery,
                    variables: { entityID: matchId },
                },
                headers,
            });

            const chatResponseBody = await chatResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: chatResponseBody
            });

            chatId = chatResponseBody.data.chatQueries.getChatroomByEntityID.chatroom?.id;
            expect(chatId).toBeDefined();

            const messageText = `Test message in match chatroom ${faker.random.alpha(5)}`;
            const sendMessageResponse = await request.post(apiURL, {
                data: {
                    query: createMessageMutation,
                    variables: { chatID: chatId, text: messageText },
                },
                headers,
            });

            const sendMessageResponseBody = await sendMessageResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: sendMessageResponseBody
            });

            messageId = sendMessageResponseBody.data.chatMutations.createMessage?.id;
            expect(messageId).toBeDefined();

            await expect.poll(async () => {
                const historyResponse = await request.post(apiURL, {
                    data: {
                        query: getMessageHistoryQuery,
                        variables: { chatID: chatId },
                    },
                    headers,
                });

                const historyResponseBody = await historyResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: historyResponseBody
                });

                const messages = historyResponseBody.data.chatQueries.historyMessages.items;
                return messages.some((msg) => msg.id === messageId && msg.text === messageText);
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("User finds news and leaves a complaint on a found comment", async ({ request }, testInfo) => {
            const postResponse = await request.post(apiURL, {
                data: { query: fetchPostsWithCommentsQuery },
                headers,
            });

            const postResponseBody = await postResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: postResponseBody
            });

            const postItems = postResponseBody.data.postQueries.feed.items;

            for (const post of postItems) {
                if (post.topLevelComments.items.length > 0) {
                    postWithCommentsId = post.id;
                    commentToReport = post.topLevelComments.items[0];
                    break;
                }
            }

            expect(postWithCommentsId).toBeDefined();
            expect(commentToReport).toBeDefined();

            const appMapping = {
                MANUTD: "manutd",
                DORTMUND: "dortmund",
                FCBAYERN: "fcbayern",
                ARSENAL: "arsenal",
                CHELSEA: "chelsea",
                LIVERPOOLFC: "liverpoolfc",
                FCBARCELONA: "fcbarcelona",
                REALMADRID: "realmadrid",
                JUVENTUS: "juventus",
                INTER: "inter",
                ACMILAN: "acmilan",
                PSG: "psg"
            };

            const originalApp = commentToReport.application;
            const mappedApp = appMapping[originalApp] || originalApp;

            const complaintResponse = await request.post(apiURL, {
                data: {
                    query: createComplaintMutation,
                    variables: {
                        id: commentToReport.id,
                        parentId: postWithCommentsId,
                        objectClass: "COMMENT",
                        parentObjectClass: "POST",
                    },
                },
                headers: {
                    ...headers,
                    "x-sportsapp-app": mappedApp,
                },
            });

            const complaintResponseBody = await complaintResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: complaintResponseBody
            });

            const complaintId = complaintResponseBody.data.complaintsMutations.createComplaint.id;
            expect(complaintResponseBody.errors).toBeUndefined();

            await expect.poll(async () => {
                const complaintsResponse = await request.post(apiURL, {
                    data: {
                        query: complaintsListQuery,
                        variables: {
                            objectClass: "COMMENT",
                            status: "OPEN",
                        },
                    },
                    headers: adminHeaders,
                });

                const complaintsData = await complaintsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: complaintsData
                });

                const complaints = complaintsData.data.complaintsQueries.feed.list || [];

                return complaints.some((complaint) => complaint.id === complaintId);
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("User leaves a comment under the news", async ({ request }, testInfo) => {
            contentVariables.objectId = postWithCommentsId;
            contentVariables.objectClass = "POST";

            lastCreatedCommentId = await createCommentFunc(request, apiURL, headers);

            await expect.poll(async () => {
                const checkResponse = await request.post(apiURL, {
                    data: {
                        query: getComments,
                        variables: contentVariables
                    },
                    headers,
                });

                const checkResponseBody = await checkResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: checkResponseBody
                });

                return checkResponseBody.data.commentsQueries.feed.items.some(
                    (comment) => comment.id === lastCreatedCommentId
                );
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("User receives a complaint on the message left before", async ({ request }, testInfo) => {
            expect(lastCreatedCommentId).toBeDefined();

            const complaintResponse = await request.post(apiURL, {
                data: {
                    query: createComplaintMutation,
                    variables: {
                        id: lastCreatedCommentId,
                        parentId: postWithCommentsId,
                        objectClass: "COMMENT",
                        parentObjectClass: "POST",
                    },
                },
                headers: adminHeaders,
            });

            const complaintResponseBody = await complaintResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: complaintResponseBody
            });

            const complaintId = complaintResponseBody.data.complaintsMutations.createComplaint.id;
            expect(complaintId).toBeDefined();

            await expect.poll(async () => {
                const complaintsResponse = await request.post(apiURL, {
                    data: {
                        query: complaintsListQuery,
                        variables: {
                            objectClass: "COMMENT",
                            status: "OPEN",
                        },
                    },
                    headers: adminHeaders,
                });

                const complaintsData = await complaintsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: complaintsData
                });

                const complaints = complaintsData.data.complaintsQueries.feed.list || [];

                return complaints.some((complaint) => complaint.id === complaintId);
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("User receives a reply to the message left before", async ({ request }, testInfo) => {
            const createdReplyId = await createReplyFunc(request, apiURL, adminHeaders, lastCreatedCommentId);

            await expect.poll(async () => {
                const checkResponse = await request.post(apiURL, {
                    data: {
                        query: getComments,
                        variables: {
                            objectId: postWithCommentsId,
                            objectClass: "POST",
                        }
                    },
                    headers: adminHeaders,
                });

                const checkResponseBody = await checkResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: checkResponseBody
                });

                const comments = checkResponseBody.data.commentsQueries.feed.items;
                const parentComment = comments.find(comment => comment.id === lastCreatedCommentId);

                return parentComment?.childThread?.items?.some(reply => reply.id === createdReplyId) || false;
            }, { timeout: 10000, intervals: [500] }).toBe(true);

            await expect.poll(async () => {
                const userCommentsResponse = await request.post(apiURL, {
                    data: {
                        query: getUserProfileCommentsQuery,
                        variables: { userId: adminUserId },
                    },
                    headers: adminHeaders,
                });

                const userCommentsBody = await userCommentsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: userCommentsBody
                });

                const userComments = userCommentsBody.data.commentsQueries.ByUser.items;

                return userComments.some(comment => comment.parentComment?.id === lastCreatedCommentId);
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("User receives a comment on the post written before", async ({ request }, testInfo) => {
            contentVariables.objectId = createdPostId;
            contentVariables.objectClass = "POST";

            adminCommentId = await createCommentFunc(request, apiURL, adminHeaders);

            await expect.poll(async () => {
                const checkResponse = await request.post(apiURL, {
                    data: {
                        query: getComments,
                        variables: contentVariables
                    },
                    headers: adminHeaders,
                });

                const checkResponseBody = await checkResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: checkResponseBody
                });

                return checkResponseBody.data.commentsQueries.feed.items.some(
                    (comment) => comment.id === adminCommentId
                );
            }, { timeout: 10000, intervals: [500] }).toBe(true);

            await expect.poll(async () => {
                const userCommentsResponse = await request.post(apiURL, {
                    data: {
                        query: getUserProfileCommentsQuery,
                        variables: { userId: adminUserId },
                    },
                    headers: adminHeaders,
                });

                const userCommentsBody = await userCommentsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: userCommentsBody
                });

                const userComments = userCommentsBody.data.commentsQueries.ByUser.items;

                return userComments.some(
                    (comment) =>
                        comment.id === adminCommentId &&
                        comment.parentTitle?.defaultValue === "Post Title"
                );
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("Admin deletes user", async ({ request }, testInfo) => {
            expect(userId).toBeDefined();

            const deleteUserResponse = await request.post(apiURL, {
                data: {
                    query: deleteUserMutation,
                    variables: { userId },
                },
                headers: adminHeaders,
            });

            const deleteUserResponseBody = await deleteUserResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: deleteUserResponseBody
            });

            expect(deleteUserResponseBody.errors).toBeUndefined();
        });

        test("Check that user's review is deleted", async ({ request }, testInfo) => {
            const reviewHeaders = {
                ...adminHeaders,
                "x-language": "uk",
                "x-country-code": "ua",
                "x-geoip2-city-country-code": "ukr",
            };

            await expect.poll(async () => {
                const response = await request.post(apiURL, {
                    data: {
                        query: getBetReviewQuery,
                        variables: { reviewID: createdReviewId },
                    },
                    headers: reviewHeaders,
                });

                const body = await response.json();

                testInfo.annotations.push({
                    type: 'response',
                    description: JSON.stringify(body, null, 2),
                });

                const status =
                    body?.errors?.[0]?.extensions?.statusString;

                return status === "NOT_FOUND";
            }, {
                timeout: 100000,
                intervals: [10000],
            }).toBe(true);
        });


        test("Check that user's post is deleted", async ({ request }, testInfo) => {
            await expect.poll(async () => {
                const feedResponse = await request.post(apiURL, {
                    data: { query: getLatestPostsQuery },
                    headers: adminHeaders,
                });

                const feedResponseBody = await feedResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: feedResponseBody
                });

                const posts = feedResponseBody.data.postQueries.feed.items;

                return !posts.some((post) => post.id === createdPostId);
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("Check that user's message in match chat is deleted", async ({ request }, testInfo) => {
            const chatHeaders = {
                ...adminHeaders,
                "x-language": "uk",
            };

            await expect.poll(async () => {
                const historyResponse = await request.post(apiURL, {
                    data: {
                        query: getMessageHistoryQuery,
                        variables: { chatID: chatId },
                    },
                    headers: chatHeaders,
                });

                const historyResponseBody = await historyResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: historyResponseBody
                });

                const messages = historyResponseBody.data.chatQueries.historyMessages.items;

                return !messages.some((msg) => msg.id === messageId);
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("Check that user's comment is wiped (text is empty)", async ({ request }, testInfo) => {
            await expect.poll(async () => {
                const commentsResponse = await request.post(apiURL, {
                    data: {
                        query: getComments,
                        variables: {
                            objectId: postWithCommentsId,
                            objectClass: "POST",
                        },
                    },
                    headers: adminHeaders,
                });

                const commentsResponseBody = await commentsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: commentsResponseBody
                });

                const comments = commentsResponseBody.data.commentsQueries.feed.items;

                const userComment = comments.find((comment) => comment.id === lastCreatedCommentId);

                return userComment?.text === "";
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("Check that user's parent comment is wiped (text is empty)", async ({ request }, testInfo) => {
            await expect.poll(async () => {
                const userCommentsResponse = await request.post(apiURL, {
                    data: {
                        query: getUserProfileCommentsQuery,
                        variables: { userId: adminUserId },
                    },
                    headers: adminHeaders,
                });

                const userCommentsBody = await userCommentsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: userCommentsBody
                });

                const userComments = userCommentsBody.data.commentsQueries.ByUser.items;

                const replyComment = userComments.find((comment) => comment.parentComment?.id === lastCreatedCommentId);

                return replyComment?.parentComment?.text === "";
            }, { timeout: 10000, intervals: [500] }).toBe(true);
        });

        test("Check that the post under which the user left a comment is missing in profile", async ({ request }, testInfo) => {
            await expect.poll(async () => {
                const userCommentsResponse = await request.post(apiURL, {
                    data: {
                        query: getUserProfileCommentsQuery,
                        variables: { userId: adminUserId },
                    },
                    headers: adminHeaders,
                });

                const userCommentsBody = await userCommentsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: userCommentsBody
                });

                const userComments = userCommentsBody.data.commentsQueries.ByUser.items;

                const commentUnderDeletedPost = userComments.find((comment) => comment.id === adminCommentId);

                return !commentUnderDeletedPost?.parentTitle?.defaultValue;
            }, { timeout: 100000, intervals: [5000] }).toBe(true);
        });
    });
};

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});