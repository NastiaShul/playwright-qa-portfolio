import { test, expect } from "@playwright/test";
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { getUserCommentsQuery, GetUserCommentsQuery, ProfileCommentsTabQuery } from "./commentQueries";

const apiURL = process.env.API_URL;
const project = await checkProject(apiURL);
const languages = await languageForProject(project);

const userIdUA = "1060562292";
const userIdBY = "1051006497";
const userIdInt = "250d2abf-8803-43b2-8e9e-21c025eca712";

let userId = apiURL.includes("ua") ? userIdUA : apiURL.includes("by") ? userIdBY : userIdInt;

test.describe(`Check comments queries on the user profile`, () => {
    test("Check if getUserComments query works", async ({ request }, testInfo) => {
        for (let language of languages) {
            const variables = {
                id: userId,
                lang: apiURL.includes("ua") ? "UK" : apiURL.includes("by") ? "BE" : "ES",
                countryCode: "DEU"
            }
            const userCommentsResponse = await request.post(apiURL, {
                data: { query: getUserCommentsQuery, variables },
                headers: {
                    'x-language': language,
                },
            });

            const userCommentsResponseBody = await userCommentsResponse.json();
            testInfo.annotations.push({
                type: 'response',
                description: userCommentsResponseBody
            });
            expect(userCommentsResponseBody.errors).toBeUndefined();

            const comments = userCommentsResponseBody.data?.commentsQueries?.ByUser?.items;
            expect(comments).toBeDefined();
            expect(Array.isArray(comments)).toBe(true);
        }
    });

    test("Check if GetUserComments query works", async ({ request }, testInfo) => {
        const userCommentsResponse = await request.post(apiURL, {
            data: { query: GetUserCommentsQuery, variables: { userId } },
        });

        const userCommentsResponseBody = await userCommentsResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: userCommentsResponseBody
        });
        expect(userCommentsResponseBody.errors).toBeUndefined();

        const comments = userCommentsResponseBody.data?.commentsQueries?.ByUser?.items;
        expect(comments).toBeDefined();
    });

    test("Check if ProfileCommentsTabQuery query works", async ({ request }, testInfo) => {
        const userCommentsResponse = await request.post(apiURL, {
            data: { query: ProfileCommentsTabQuery, variables: { userId } },
        });

        const userCommentsResponseBody = await userCommentsResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: userCommentsResponseBody
        });
        expect(userCommentsResponseBody.errors).toBeUndefined();

        const comments = userCommentsResponseBody.data?.commentsQueries?.ByUser?.items;
        expect(comments).toBeDefined();
    });
});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});