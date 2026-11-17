import { test, expect } from "@playwright/test";
import { fetchNewsWithCommentsQuery } from "../apiNews/newsQuery";
import { getCommentsSuperTagsQuery } from "./commentQueries";

const apiURL = process.env.API_URL;

test("Check if getCommentsSuperTagsQuery query works", async ({ request }, testInfo) => {
    const postResponse = await request.post(apiURL, {
        data: { query: fetchNewsWithCommentsQuery },
    });

    const postResponseBody = await postResponse.json();
    testInfo.annotations.push({ type: 'response', description: postResponseBody });

    const postItems = postResponseBody.data.newsQueries.feed.items;
    let postWithCommentsId;

    for (const post of postItems) {
        if (post.topLevelComments.items.length > 0) {
            postWithCommentsId = post.id;
            break;
        }
    }

    if (postWithCommentsId !== undefined) {
        expect(postWithCommentsId).toBeDefined();

        const commentsResponse = await request.post(apiURL, {
            data: { query: getCommentsSuperTagsQuery, variables: { objectId: postWithCommentsId } },
        });

        const commentsResponseBody = await commentsResponse.json();
        testInfo.annotations.push({ type: 'response', description: commentsResponseBody });

        const commentsSuperTagsArray = commentsResponseBody.data.commentsQueries.CommentsSuperTags;
        expect(commentsSuperTagsArray).toBeDefined();
        expect(commentsSuperTagsArray).toBeInstanceOf(Array);
    }

});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});