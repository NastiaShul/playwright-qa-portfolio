import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { getAuthToken } from "../utils/functions/getAuthToken.js";
import { createBlogMutation } from "../apiRegression/apiBlogs/blogMutations.js";
import { getUsersBlogs, feedByCurrentUsersBlogs } from "../apiRegression/apiBlogs/blogQueries.js";
import { createEmptyPostMutation, updatePostMutation } from "../apiRegression/apiPosts/postMutation.js";
import { getCurrentUserPostsQuery } from "../apiRegression/apiPosts/postQueries.js";
import { createThreadMutatuion } from "../apiRegression/apiThreads/threadMutations.js";
import { getAllThreadsQuery } from "../apiRegression/apiThreads/threadQueries.js";

const apiURL = process.env.API_URL;
const { token, userId } = getAuthToken().user;

if (!apiURL.includes("ua") && !apiURL.includes("by")) {

    test("Create multi lang blog and post inside it", async ({ request }, testInfo) => {

        let blogId;
        const headers = {
            "X-Auth-Token": token
        };

        await test.step("Create and verify user's blog", async () => {
            const title = `Test EN blog ${faker.random.alpha(5)}`;
            const description = `This is a test EN language blog - ${faker.random.alpha(5)}`;

            const variables = {
                title: title,
                description: description,
            };

            const createResponse = await request.post(apiURL, {
                data: { query: createBlogMutation, variables },
                headers: {
                    ...headers,
                    "X-language": "en",
                },
            });

            expect(createResponse.ok()).toBeTruthy();
            const createBody = await createResponse.json();
            testInfo.annotations.push({ type: 'response', description: createBody });

            const createdBlog = createBody?.data?.blogMutations?.createBlog;
            expect(createdBlog).toBeDefined();
            expect(createdBlog.title).toBe(title);
            expect(createdBlog.description).toBe(description);

            blogId = createdBlog.id;

            const getResponse = await request.post(apiURL, {
                data: { query: getUsersBlogs, variables: { userID: userId } },
                headers: {
                    ...headers,
                    "X-language": "en",
                },
            });

            expect(getResponse.ok()).toBeTruthy();
            const getResponseBody = await getResponse.json();
            testInfo.annotations.push({ type: 'response', description: getResponseBody });

            const blogs = getResponseBody?.data?.blogsQueries?.ByUser?.items || [];
            const foundBlog = blogs.find((b) => b.id === createdBlog.id);

            expect(foundBlog).toBeDefined();
            expect(foundBlog.title).toBe(title);
            expect(foundBlog.description).toBe(description);
        });

        await test.step("Create post for blog", async () => {
            expect(blogId).toBeDefined();

            const createPostResponse = await request.post(apiURL, {
                data: { query: createEmptyPostMutation },
                headers: {
                    ...headers,
                    "X-language": "en",
                },
            });

            const createPostResponseBody = await createPostResponse.json();
            expect(createPostResponseBody.data).toBeDefined();
            const createdPostId = createPostResponseBody.data.postMutations.createEmpty;
            expect(createdPostId).toBeDefined();

            const structuredBody = JSON.stringify([
                {
                    type: "paragraph",
                    value: {
                        elements: [{ type: "text", value: { text: "This is a sample post content inside a blog." } }],
                        size: "regular",
                    },
                },
            ]);

            const updateVariables = {
                post: {
                    id: createdPostId,
                    title: { ["en"]: "Post Title in Blog" },
                    structuredBody: { ["en"]: structuredBody },
                    status: "PUBLISHED",
                    blogID: blogId,
                    languages: ["EN"],
                    mainSport: "FOOTBALL"
                }
            };

            const updateResponse = await request.post(apiURL, {
                data: { query: updatePostMutation, variables: updateVariables },
                headers: {
                    ...headers,
                    "X-language": "en",
                },
            });

            const updateResponseBody = await updateResponse.json();
            expect(updateResponseBody.errors).toBeUndefined();
            expect(updateResponseBody.data).toBeDefined();

            await expect.poll(async () => {
                const getPostsResponse = await request.post(apiURL, {
                    data: { query: getCurrentUserPostsQuery },
                    headers: {
                        ...headers,
                        "X-language": "en",
                    },
                });

                const postsResponseBody = await getPostsResponse.json();
                const userPosts = postsResponseBody.data.postQueries.currentUserFeed.items || [];
                const foundPost = userPosts.find((post) => post.id === createdPostId);

                return foundPost?.title?.defaultValue === "Post Title in Blog";
            }, { timeout: 30000, intervals: [3000] }).toBe(true);
        });

        await test.step("Verify blog does not exist in forbidden locales", async () => {
            const forbiddenLocales = ["FR", "DE", "IT", "ES", "AR"];

            const getFeedResponse = await request.post(apiURL, {
                data: { query: feedByCurrentUsersBlogs },
                headers: {
                    ...headers,
                    "X-language": "en",
                },
            });

            expect(getFeedResponse.ok()).toBeTruthy();
            const feedBody = await getFeedResponse.json();

            const blogsFeed = feedBody?.data?.blogsQueries?.feedByCurrentUser || [];
            const myBlog = blogsFeed.find((b) => b.id === blogId);
            expect(myBlog).toBeDefined();

            expect(myBlog.languages).toEqual(expect.not.arrayContaining(forbiddenLocales));
        });

        await test.step("Create FR post for blog and verify updated locales", async () => {
            expect(blogId).toBeDefined();

            const frHeaders = {
                ...headers,
                "X-language": "fr",
            };

            const createPostResponse = await request.post(apiURL, {
                data: { query: createEmptyPostMutation },
                headers: frHeaders,
            });

            const createPostResponseBody = await createPostResponse.json();
            expect(createPostResponseBody.data).toBeDefined();
            const createdPostId = createPostResponseBody.data.postMutations.createEmpty;
            expect(createdPostId).toBeDefined();

            const structuredBody = JSON.stringify([
                {
                    type: "paragraph",
                    value: {
                        elements: [{ type: "text", value: { text: "Ceci est un exemple de contenu de post en français." } }],
                        size: "regular",
                    },
                },
            ]);

            const updateVariables = {
                post: {
                    id: createdPostId,
                    title: { ["fr"]: "Titre du post en Français" },
                    structuredBody: { ["fr"]: structuredBody },
                    status: "PUBLISHED",
                    blogID: blogId,
                    languages: ["FR"],
                    mainSport: "FOOTBALL"
                }
            };

            const updateResponse = await request.post(apiURL, {
                data: { query: updatePostMutation, variables: updateVariables },
                headers: frHeaders,
            });

            const updateResponseBody = await updateResponse.json();
            expect(updateResponseBody.errors).toBeUndefined();
            expect(updateResponseBody.data).toBeDefined();

            await expect.poll(async () => {
                const getFeedResponse = await request.post(apiURL, {
                    data: { query: feedByCurrentUsersBlogs },
                    headers: frHeaders,
                });

                const feedBody = await getFeedResponse.json();
                const blogsFeed = feedBody?.data?.blogsQueries?.feedByCurrentUser || [];
                const myBlog = blogsFeed.find((b) => b?.id === blogId);

                return myBlog?.languages?.includes("FR");
            }, { timeout: 30000, intervals: [3000] }).toBe(true);

            const finalFeedResponse = await request.post(apiURL, {
                data: { query: feedByCurrentUsersBlogs },
                headers: frHeaders,
            });

            const finalFeedBody = await finalFeedResponse.json();
            const finalBlog = finalFeedBody?.data?.blogsQueries?.feedByCurrentUser?.find((b) => b?.id === blogId);

            expect(finalBlog).toBeDefined();
            expect(finalBlog.languages).toContain("FR");
            expect(finalBlog.languages).toContain("EN");

            const remainingForbiddenLocales = ["DE", "IT", "ES", "AR"];
            expect(finalBlog.languages).toEqual(expect.not.arrayContaining(remainingForbiddenLocales));
        });
    });

    test("Create multi lang blog and thread inside it", async ({ request }, testInfo) => {

        let blogId;
        const headers = {
            "X-Auth-Token": token
        };

        await test.step("Create and verify user's blog", async () => { 
            const title = `Test IT blog ${faker.random.alpha(5)}`;
            const description = `This is a test IT language blog - ${faker.random.alpha(5)}`;

            const variables = {
                title: title,
                description: description,
            };

            const createResponse = await request.post(apiURL, {
                data: { query: createBlogMutation, variables },
                headers: {
                    ...headers,
                    "X-language": "it",
                },
            });

            expect(createResponse.ok()).toBeTruthy();
            const createBody = await createResponse.json();
            testInfo.annotations.push({ type: 'response', description: createBody });

            const createdBlog = createBody?.data?.blogMutations?.createBlog;
            expect(createdBlog).toBeDefined();
            expect(createdBlog.title).toBe(title);
            expect(createdBlog.description).toBe(description);

            blogId = createdBlog.id;

            const getResponse = await request.post(apiURL, {
                data: { query: getUsersBlogs, variables: { userID: userId } },
                headers: {
                    ...headers,
                    "X-language": "it",
                },
            });

            expect(getResponse.ok()).toBeTruthy();
            const getResponseBody = await getResponse.json();
            testInfo.annotations.push({ type: 'response', description: getResponseBody });

            const blogs = getResponseBody?.data?.blogsQueries?.ByUser?.items || [];
            const foundBlog = blogs.find((b) => b.id === createdBlog.id);

            expect(foundBlog).toBeDefined();
            expect(foundBlog.title).toBe(title);
            expect(foundBlog.description).toBe(description);
        });

        await test.step("Create thread for blog", async () => {
            expect(blogId).toBeDefined();

            const structuredBodyIT = JSON.stringify([
                {
                    type: "paragraph",
                    value: {
                        elements: [{ type: "text", value: { text: "This is a sample thread content inside an IT blog." } }],
                        size: "regular",
                    },
                },
            ]);

            const threadVariables = {
                blogID: blogId,
                structuredBody: structuredBodyIT,
                tagIDs: []
            };

            const createThreadResponse = await request.post(apiURL, {
                data: { query: createThreadMutatuion, variables: threadVariables },
                headers: {
                    ...headers,
                    "X-language": "it",
                },
            });

            const createThreadResponseBody = await createThreadResponse.json();
            expect(createThreadResponseBody.errors).toBeUndefined();
            expect(createThreadResponseBody.data).toBeDefined();

            const createdThreadId = createThreadResponseBody.data?.threadMutations?.create;
            expect(createdThreadId).toBeDefined();

            await expect.poll(async () => {
                const getThreadsResponse = await request.post(apiURL, {
                    data: { query: getAllThreadsQuery },
                    headers: {
                        ...headers,
                        "X-language": "it",
                    },
                });

                const threadsResponseBody = await getThreadsResponse.json();
                const feedItems = threadsResponseBody?.data?.threadQueries?.feed?.items || [];

                return feedItems.some((item) => item.id === createdThreadId);
            }, { timeout: 30000, intervals: [3000] }).toBe(true);
        });

        await test.step("Verify blog does not exist in forbidden locales", async () => {
            const forbiddenLocales = ["FR", "DE", "EN", "ES", "AR"];

            const getFeedResponse = await request.post(apiURL, {
                data: { query: feedByCurrentUsersBlogs },
                headers: headers,
            });

            expect(getFeedResponse.ok()).toBeTruthy();
            const feedBody = await getFeedResponse.json();

            const blogsFeed = feedBody?.data?.blogsQueries?.feedByCurrentUser || [];
            const myBlog = blogsFeed.find((b) => b.id === blogId);
            expect(myBlog).toBeDefined();

            expect(myBlog.languages).toEqual(expect.not.arrayContaining(forbiddenLocales));
        });

        await test.step("Create ES thread for blog and verify updated locales", async () => {
            expect(blogId).toBeDefined();

            const esHeaders = {
                ...headers,
                "X-language": "es",
            };

            const structuredBodyES = JSON.stringify([
                {
                    type: "paragraph",
                    value: {
                        elements: [{ type: "text", value: { text: "Este es un ejemplo de contenido de hilo en español." } }],
                        size: "regular",
                    },
                },
            ]);

            const esThreadVariables = {
                blogID: blogId,
                structuredBody: structuredBodyES,
                tagIDs: []
            };

            const createEsThreadResponse = await request.post(apiURL, {
                data: { query: createThreadMutatuion, variables: esThreadVariables },
                headers: esHeaders,
            });

            const createEsThreadResponseBody = await createEsThreadResponse.json();
            expect(createEsThreadResponseBody.errors).toBeUndefined();
            expect(createEsThreadResponseBody.data).toBeDefined();

            const createdEsThreadId = createEsThreadResponseBody.data?.threadMutations?.create;
            expect(createdEsThreadId).toBeDefined();

            await expect.poll(async () => {
                const getFeedResponse = await request.post(apiURL, {
                    data: { query: feedByCurrentUsersBlogs },
                    headers: esHeaders,
                });

                const feedBody = await getFeedResponse.json();
                const blogsFeed = feedBody?.data?.blogsQueries?.feedByCurrentUser || [];
                const myBlog = blogsFeed.find((b) => b?.id === blogId);

                return myBlog?.languages?.includes("ES");
            }, { timeout: 30000, intervals: [3000] }).toBe(true);

            const finalFeedResponse = await request.post(apiURL, {
                data: { query: feedByCurrentUsersBlogs },
                headers: headers,
            });

            const finalFeedBody = await finalFeedResponse.json();
            const finalBlog = finalFeedBody?.data?.blogsQueries?.feedByCurrentUser?.find((b) => b?.id === blogId);

            expect(finalBlog).toBeDefined();
            expect(finalBlog.languages).toContain("IT");
            expect(finalBlog.languages).toContain("ES");

            const remainingForbiddenLocales = ["DE", "FR", "EN", "AR"];
            expect(finalBlog.languages).toEqual(expect.not.arrayContaining(remainingForbiddenLocales));
        });
    });
}