import { test, expect } from "@playwright/test";
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { fetchFirstNewsId, contentVariables } from "../../utils/functions/commentFunctions";
import { getComments, commentList, getBestCommentsQuery, GetPopularCommentsQuery, CommentTopLevelFieldsQuery } from "./commentQueries";

const apiURL = process.env.API_URL;
const project = await checkProject(apiURL);
const languages = await languageForProject(project);

test("Check if getComments query works", async ({ request, isMobile }, testInfo) => {
    if (isMobile === false) {
        const firstNewsId = await fetchFirstNewsId(request, apiURL);
        contentVariables.objectId = firstNewsId;

        const response = await request.post(apiURL, {
            data: {
                query: getComments,
                variables: contentVariables,
            },
        });

        const responseBody = await response.json();
        testInfo.annotations.push({ type: 'response', description: responseBody });

        expect(responseBody.errors).toBeUndefined();
        expect(responseBody.data?.commentsQueries?.feed?.items).toBeDefined();

        const items = responseBody.data.commentsQueries.feed.items;
        if (items.length > 0) {
            const comment = items[0];

            expect(comment.id).toBeDefined();
            expect(comment.text).toBeDefined();
            expect(typeof comment.text).toBe('string');
            expect(comment.objectId).toBe(firstNewsId);
            expect(comment.objectClass).toBe(contentVariables.objectClass);

            expect(comment.isReadByUser).toBeDefined();
            expect(typeof comment.isReadByUser).toBe('boolean');
            expect(typeof comment.created).toBe('number');
            expect(typeof comment.edited).toBe('number');
            expect(typeof comment.isDeleted).toBe('boolean');
            expect(typeof comment.isReplyToTopLevelComment).toBe('boolean');

            expect(comment.user).toBeDefined();
            expect(comment.user.name).toBeDefined();
            expect(typeof comment.user.name).toBe('string');
            expect(comment.user.avatar).toBeDefined();
            expect(comment.user.id).toBeDefined();
            expect(comment.user.roles).toBeInstanceOf(Array);
            // expect(comment.user.roles[0].ID).toBe('user');

            expect(comment.reactions).toBeDefined();
            expect(comment.reactions.likeCount).toBeGreaterThanOrEqual(0);
            expect(comment.reactions.dislikeCount).toBeGreaterThanOrEqual(0);

            expect(comment.threadCommentsCount).toBeGreaterThanOrEqual(0);

            expect(comment.parentComment).toBeDefined();

            expect(comment.childThread).toBeDefined();
            expect(comment.childThread.items).toBeInstanceOf(Array);
            expect(comment.childThread.paginationInfo).toBeDefined();
            expect(comment.childThread.paginationInfo.totalItemsCount).toBeGreaterThanOrEqual(0);
            expect(typeof comment.childThread.paginationInfo.hasNextPage).toBe('boolean');
            expect(typeof comment.childThread.paginationInfo.endCursor).toBe('string');
        }

        const pagination = responseBody.data.commentsQueries.feed.paginationInfo;
        expect(pagination.totalItemsCount).toBeGreaterThanOrEqual(0);
        expect(pagination.hasNextPage).toBeDefined();
        expect(typeof pagination.hasNextPage).toBe('boolean');
        expect(pagination.endCursor).toBeDefined();
        expect(typeof pagination.endCursor).toBe('string');
    }
});

test("Check if commentList query works", async ({ request, isMobile }, testInfo) => {
    if (isMobile === false) {
        const firstNewsId = await fetchFirstNewsId(request, apiURL);
        contentVariables.objectId = firstNewsId;

        const response = await request.post(apiURL, {
            data: {
                query: commentList,
                variables: contentVariables,
            },
        });

        const responseBody = await response.json();
        testInfo.annotations.push({ type: 'response', description: responseBody });

        expect(responseBody.errors).toBeUndefined();
        expect(responseBody.data?.commentsQueries?.feed?.items).toBeDefined();

        const items = responseBody.data.commentsQueries.feed.items;
        if (items.length > 0) {
            const comment = items[0];

            expect(comment.id).toBeDefined();
            expect(typeof comment.id).toBe('string');
            expect(comment.created).toBeDefined();
            expect(typeof comment.created).toBe('number');
            expect(comment.isDeleted).toBeDefined();
            expect(typeof comment.isDeleted).toBe('boolean');
            expect(comment.isReadByUser).toBeDefined();
            expect(typeof comment.isReadByUser).toBe('boolean');

            const user = comment.user;
            expect(user).toBeDefined();
            expect(user.id).toBeDefined();
            expect(typeof user.id).toBe('string');
            expect(user.name).toBeDefined();
            expect(typeof user.name).toBe('string');
            expect(user.avatar).toBeDefined();
            expect(typeof user.avatar === 'object' || user.avatar === null).toBe(true);
            if (user.avatar !== null) {
                expect(user.avatar).toHaveProperty('url');
                expect(typeof user.avatar.url).toBe('string');
            }
            expect(user.hasActiveSubscription).toBeDefined();
            expect(typeof user.hasActiveSubscription === 'boolean' || user.hasActiveSubscription === null).toBe(true);
            expect(comment.parentComment).toBeDefined();
            expect(comment.reactions).toBeDefined();
            expect(comment.reactions.likeCount).toBeDefined();
            expect(typeof comment.reactions.likeCount).toBe('number');
            expect(comment.reactions.dislikeCount).toBeDefined();
            expect(typeof comment.reactions.dislikeCount).toBe('number');
            expect(comment.reactions.userReaction).toBeDefined();

            expect(comment.text).toBeDefined();
            expect(typeof comment.text).toBe('string');
            expect(comment.application).toBeDefined();
            expect(typeof comment.application === 'string' || comment.application === null).toBe(true);

            expect(comment.childThread).toBeDefined();
            expect(comment.childThread.items).toBeInstanceOf(Array);
            if (comment.childThread.items > 0) {
                const childThread = items[0];

                expect(childThread.id).toBeDefined();
                expect(typeof childThread.id).toBe('string');
                expect(childThread.created).toBeDefined();
                expect(typeof childThread.created).toBe('number');
                expect(childThread.isDeleted).toBeDefined();
                expect(typeof childThread.isDeleted).toBe('boolean');
                expect(childThread.isReadByUser).toBeDefined();
                expect(typeof childThread.isReadByUser).toBe('boolean');

                const user = childThread.user;
                expect(user).toBeDefined();
                expect(user.id).toBeDefined();
                expect(typeof user.id).toBe('string');
                expect(user.name).toBeDefined();
                expect(typeof user.name).toBe('string');
                expect(user.avatar).toBeDefined();
                expect(typeof user.avatar === 'object' || user.avatar === null).toBe(true);
                if (user.avatar !== null) {
                    expect(user.avatar).toHaveProperty('url');
                    expect(typeof user.avatar.url).toBe('string');
                }
                expect(user.hasActiveSubscription).toBeDefined();
                expect(typeof user.hasActiveSubscription === 'boolean' || user.hasActiveSubscription === null).toBe(true);
                expect(childThread.parentComment).toBeDefined();
            }
            expect(comment.childThread.paginationInfo).toBeDefined();
            expect(comment.childThread.paginationInfo.totalItemsCount).toBeGreaterThanOrEqual(0);
            expect(typeof comment.childThread.paginationInfo.hasNextPage).toBe('boolean');
            expect(typeof comment.childThread.paginationInfo.endCursor).toBe('string');
        }

        const pagination = responseBody.data.commentsQueries.feed.paginationInfo;
        expect(pagination.endCursor).toBeDefined();
        expect(typeof pagination.endCursor).toBe('string');
        expect(pagination.totalItemsCount).toBeGreaterThanOrEqual(0);
        expect(pagination.hasNextPage).toBeDefined();
        expect(typeof pagination.hasNextPage).toBe('boolean');
        expect(pagination.hasPrevPage).toBeDefined();
        expect(typeof pagination.hasPrevPage).toBe('boolean');

    }
});

test("Check if CommentTopLevelFieldsQuery query works", async ({ request, isMobile }, testInfo) => {
    if (isMobile === false) {
        const firstNewsId = await fetchFirstNewsId(request, apiURL);
        contentVariables.objectId = firstNewsId;

        const response = await request.post(apiURL, {
            data: {
                query: CommentTopLevelFieldsQuery,
                variables: contentVariables,
            },
        });

        const responseBody = await response.json();
        testInfo.annotations.push({ type: 'response', description: responseBody });

        expect(responseBody.errors).toBeUndefined();
        expect(responseBody.data?.commentsQueries?.feed?.items).toBeDefined();
    }
});

test.describe("Check if getBestCommentsQuery works", () => {
    for (const language of languages) {
        test(`Check if getBestCommentsQuery WEEK query works for ${language} language`, async ({ request }, testInfo) => {
            {
                const response = await request.post(apiURL, {
                    data: {
                        query: getBestCommentsQuery,
                        variables: { period: "WEEK" }
                    },
                    headers: { "X-language": language }
                });

                const responseBody = await response.json();
                testInfo.annotations.push({ type: 'response', description: responseBody });

                expect(responseBody.errors).toBeUndefined();
                expect(responseBody.data?.commentsQueries?.feedPopular?.items).toBeDefined();
            }
        });

        test(`Check if getBestCommentsQuery DAY query works for ${language} language`, async ({ request }, testInfo) => {
            {
                const response = await request.post(apiURL, {
                    data: {
                        query: getBestCommentsQuery,
                        variables: { period: "DAY" }
                    },
                    headers: { "X-language": language }
                });

                const responseBody = await response.json();
                testInfo.annotations.push({ type: 'response', description: responseBody });

                expect(responseBody.errors).toBeUndefined();
                expect(responseBody.data?.commentsQueries?.feedPopular?.items).toBeDefined();
            }
        });
    }
});

test.describe("Check if GetPopularCommentsQuery works", () => {
    for (const language of languages) {
        test(`Check if GetPopularCommentsQuery query works for ${language} language`, async ({ request }, testInfo) => {
            {
                const response = await request.post(apiURL, {
                    data: {
                        query: GetPopularCommentsQuery
                    },
                    headers: { "X-language": language }
                });

                const responseBody = await response.json();
                testInfo.annotations.push({ type: 'response', description: responseBody });

                expect(responseBody.errors).toBeUndefined();
                expect(responseBody.data?.commentsQueries?.commentsByDay?.items).toBeDefined();
            }
        });
    }
});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});