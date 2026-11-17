import { test, expect } from "@playwright/test";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import {
    fetchFirstNewsId,
    createCommentFunc,
    createReplyFunc,
    editCommentFunc,
    deleteCommentFunc,
    contentVariables,
    createdCommentIds,
    createdReplyIds,
    adminDeleteCommentFunc
} from "../../utils/functions/commentFunctions.js";
import { getComments } from "./commentQueries.js";

const apiURL = process.env.API_URL;
let headers = {};
const token = getAuthToken().user.token;
const adminToken = getAuthToken().admin.token;
let language = apiURL?.includes("ua") ? "uk" : apiURL?.includes("by") ? "be" : "en";

test.beforeEach(async ({ request }) => {
    headers = {
        "X-Auth-Token": token,
        "X-Language": language,
    };

    const firstNewsId = await fetchFirstNewsId(request, apiURL, headers);
    contentVariables.objectId = firstNewsId;
});

test("Create a comment", async ({ request }, testInfo) => {
    const createdCommentId = await createCommentFunc(request, apiURL, headers);
    createdCommentIds.push(createdCommentId);

    await expect.poll(async () => {
        const response = await request.post(apiURL, {
            data: { query: getComments, variables: contentVariables },
            headers
        });

        const body = await response.json();
        testInfo.annotations.push({ type: 'response', description: body });

        return body.data.commentsQueries.feed.items.some(c => c.id === createdCommentId);
    }, { timeout: 20000, intervals: [1000] }).toBe(true);
});

test("Create and edit comment", async ({ request }, testInfo) => {
    const createdCommentId = await createCommentFunc(request, apiURL, headers);
    createdCommentIds.push(createdCommentId);
    const editedText = await editCommentFunc(request, apiURL, headers, createdCommentId);

    await expect.poll(async () => {
        const response = await request.post(apiURL, {
            data: { query: getComments, variables: contentVariables },
            headers
        });

        const body = await response.json();
        testInfo.annotations.push({ type: 'response', description: body });

        const comment = body.data.commentsQueries.feed.items.find(c => c.id === createdCommentId);
        return comment?.text === editedText;
    }, { timeout: 20000, intervals: [1000] }).toBe(true);
});

test("Create and delete comment", async ({ request }, testInfo) => {
    const createdCommentId = await createCommentFunc(request, apiURL, headers);
    createdCommentIds.push(createdCommentId);
    await deleteCommentFunc(request, apiURL, headers, createdCommentId);

    await expect.poll(async () => {
        const response = await request.post(apiURL, {
            data: { query: getComments, variables: contentVariables },
            headers
        });

        const body = await response.json();
        testInfo.annotations.push({ type: 'response', description: body });

        return !body.data.commentsQueries.feed.items.some(c => c.id === createdCommentId);
    }, { timeout: 20000, intervals: [1000] }).toBe(true);
});

test("Create reply to comment", async ({ request }, testInfo) => {
    const createdCommentId = await createCommentFunc(request, apiURL, headers);
    createdCommentIds.push(createdCommentId);
    const createdReplyId = await createReplyFunc(request, apiURL, headers, createdCommentId);
    createdReplyIds.push(createdReplyId);

    await expect.poll(async () => {
        const response = await request.post(apiURL, {
            data: { query: getComments, variables: contentVariables },
            headers
        });

        const body = await response.json();
        testInfo.annotations.push({ type: 'response', description: body });

        const comment = body.data.commentsQueries.feed.items.find(c => c.id === createdCommentId);
        return comment?.childThread?.items?.some(r => r.id === createdReplyId) || false;
    }, { timeout: 20000, intervals: [1000] }).toBe(true);
});

test("Create and edit reply", async ({ request }, testInfo) => {
    const createdCommentId = await createCommentFunc(request, apiURL, headers);
    createdCommentIds.push(createdCommentId);
    const createdReplyId = await createReplyFunc(request, apiURL, headers, createdCommentId);
    createdReplyIds.push(createdReplyId);
    const editedText = await editCommentFunc(request, apiURL, headers, createdReplyId);

    await expect.poll(async () => {
        const response = await request.post(apiURL, {
            data: { query: getComments, variables: contentVariables },
            headers
        });

        const body = await response.json();
        testInfo.annotations.push({ type: 'response', description: body });

        const comment = body.data.commentsQueries.feed.items.find(c => c.id === createdCommentId);
        const reply = comment?.childThread?.items?.find(r => r.id === createdReplyId);

        return reply?.text === editedText;
    }, { timeout: 20000, intervals: [1000] }).toBe(true);
});

test("Create and delete reply", async ({ request }, testInfo) => {
    const createdCommentId = await createCommentFunc(request, apiURL, headers);
    createdCommentIds.push(createdCommentId);
    const createdReplyId = await createReplyFunc(request, apiURL, headers, createdCommentId);
    createdReplyIds.push(createdReplyId);
    await deleteCommentFunc(request, apiURL, headers, createdReplyId);

    await expect.poll(async () => {
        const response = await request.post(apiURL, {
            data: { query: getComments, variables: contentVariables },
            headers
        });

        const body = await response.json();
        testInfo.annotations.push({ type: 'response', description: body });

        const comment = body.data.commentsQueries.feed.items.find(c => c.id === createdCommentId);
        return !comment?.childThread?.items?.some(r => r.id === createdReplyId);
    }, { timeout: 20000, intervals: [1000] }).toBe(true);
});

test.afterEach(async ({ request }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }

    const adminHeaders = {
        "X-Auth-Token": adminToken,
        "X-Language": language,
    };

    const cleanupReplies = createdReplyIds.map(id => 
        adminDeleteCommentFunc(request, apiURL, adminHeaders, id).catch(e => console.log(`Failed to delete reply ${id}:`, e))
    );
    
    await Promise.allSettled(cleanupReplies);

    const cleanupComments = createdCommentIds.map(id => 
        adminDeleteCommentFunc(request, apiURL, adminHeaders, id).catch(e => console.log(`Failed to delete comment ${id}:`, e))
    );

    await Promise.allSettled(cleanupComments);

    createdReplyIds.length = 0;
    createdCommentIds.length = 0;
});

