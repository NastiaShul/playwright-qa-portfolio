import { test, expect } from "@playwright/test";
import { getAuthToken } from "../../utils/functions/getAuthToken";
import { fetchFirstNewsId, createCommentFunc, createReplyFunc, getUnreadDiscussions, contentVariables, createdCommentIds, createdReplyIds, adminDeleteCommentFunc } from "../../utils//functions/commentFunctions";

const apiURL = process.env.API_URL;
const headers = {"X-auth-token": getAuthToken().user.token };
const headers2 = {"X-auth-token": getAuthToken().admin.token };

test.beforeEach(async ({ request }) => {
    const firstNewsId = await fetchFirstNewsId(request, apiURL, headers);
    contentVariables.objectId = firstNewsId;
});

test("Check unread after the reply", async ({ request, isMobile }) => {
    if (!isMobile) {
        const initialState = await getUnreadDiscussions(request, apiURL, headers);
        const initialUnreadCount = initialState.unreadDiscussionsCount;

        const createdCommentId = await createCommentFunc(request, apiURL, headers);
        createdCommentIds.push(createdCommentId);
        const createdReplyId = await createReplyFunc(request, apiURL, headers2, createdCommentId);
        createdReplyIds.push(createdReplyId);

        await expect.poll(async () => {
            const updatedState = await getUnreadDiscussions(request, apiURL, headers);
            const feedItem = updatedState.feed.items.find(
                (item) => item.userFirstComment.id === createdCommentId
            );
            const replyItem = feedItem?.userFirstComment?.childThread?.items?.find(
                (reply) => reply.id === createdReplyId
            );

            return {
                unreadCount: updatedState.unreadDiscussionsCount,
                replyIdMatches: replyItem?.id === createdReplyId,
            };
        }, { timeout: 200000, intervals: [10000] }).toEqual({
            unreadCount: initialUnreadCount + 1,
            replyIdMatches: true,
        });
    }
});

test.afterEach(async ({ request }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }

    const cleanupReplies = createdReplyIds.map(id => 
        adminDeleteCommentFunc(request, apiURL, headers2, id).catch(e => console.log(`Failed to delete reply ${id}:`, e))
    );
    
    await Promise.allSettled(cleanupReplies);

    const cleanupComments = createdCommentIds.map(id => 
        adminDeleteCommentFunc(request, apiURL, headers2, id).catch(e => console.log(`Failed to delete comment ${id}:`, e))
    );

    await Promise.allSettled(cleanupComments);

    createdReplyIds.length = 0;
    createdCommentIds.length = 0;
});