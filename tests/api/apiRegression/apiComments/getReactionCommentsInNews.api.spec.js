import { test, expect } from "@playwright/test";
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { fetchNewsWithCommentsQuery } from "../../apiRegression/apiNews/newsQuery";
import { getReactionCommentsInNewsQuery } from "./commentQueries";

const apiURL = process.env.API_URL;
const project = await checkProject(apiURL);
const languages = await languageForProject(project);

test("Check if GetReactionCommentsInNews query works", async ({ request }, testInfo) => {
    for (let language of languages) {
        const newsResponse = await request.post(apiURL, {
            data: { query: fetchNewsWithCommentsQuery },
            headers: {
                'x-language': language,
            },
        });

        const newsResponseBody = await newsResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: newsResponseBody
        });
        expect(newsResponseBody.errors).toBeUndefined();

        const newsItems = newsResponseBody.data.newsQueries.feed.items;
        let newsWithCommentsId;

        for (const news of newsItems) {
            if (news.topLevelComments.items.length > 0) {
                newsWithCommentsId = news.id;
                break;
            }
        }
        if (newsWithCommentsId !== undefined) {
            const reactionCommentsResponse = await request.post(apiURL, {
                data: { query: getReactionCommentsInNewsQuery, variables: { id: newsWithCommentsId } },
            });
            const reactionCommentsResponseBody = await reactionCommentsResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: reactionCommentsResponseBody
            });
            expect(reactionCommentsResponseBody.errors).toBeUndefined();

            const reactionCommentsArray = reactionCommentsResponseBody.data.newsQueries.get.topLevelComments.items;
            expect(reactionCommentsArray).toBeDefined();
            expect(reactionCommentsArray).toBeInstanceOf(Array);
            expect(reactionCommentsArray.length).toBeGreaterThan(0);
            for (const comment of reactionCommentsArray) {
                expect(comment.id).toBeDefined();
                expect(comment.objectClass).toBeDefined();
                
                expect(comment.reactions).toBeDefined();
                expect(comment.reactions.userReaction).toBeDefined();
                expect(comment.reactions.likeCount).toBeDefined();
                expect(comment.reactions.dislikeCount).toBeDefined();
            
                expect(comment.childThread).toBeDefined();
                expect(comment.childThread.items).toBeDefined();
                if( comment.childThread.items.length > 0) {
                    for (const childComment of comment.childThread.items) {
                        expect(childComment.id).toBeDefined();
                        expect(childComment.objectClass).toBeDefined();
                        expect(childComment.reactions).toBeDefined();
                        expect(childComment.reactions.userReaction).toBeDefined();
                        expect(childComment.reactions.likeCount).toBeDefined();
                        expect(childComment.reactions.dislikeCount).toBeDefined();
                    }
                }
            }
        }

    }
});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});