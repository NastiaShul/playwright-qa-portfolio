import { test, expect } from "@playwright/test";
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { getCurrentUserHasPostsQuery, PostsDraftsByUserIdQuery } from "./userQueries.js";

const apiURL = process.env.API_URL;
const token = getAuthToken().user.token;
const project = await checkProject(apiURL);
const languages = await languageForProject(project);

test.describe("Check if getCurrentUserHasPostsQuery query works", () => {

    test("Check PUPBLISHED posts", async ({ request }, testInfo) => {
        const response = await request.post(apiURL, {
            data: {
                query: getCurrentUserHasPostsQuery,
                variables: { postStatus: "PUBLISHED" },
            },
            headers: {
                "X-Auth-Token": token,
            }
        });

        const responseBody = await response.json();

        testInfo.annotations.push({ type: 'response', description: responseBody });

        expect(responseBody.errors).toBeUndefined();
        expect(responseBody.data?.postQueries?.currentUserFeed?.items).toBeDefined();

    });

    test("Check UNPUBLISHED posts", async ({ request }, testInfo) => {
        const response = await request.post(apiURL, {
            data: {
                query: getCurrentUserHasPostsQuery,
                variables: { postStatus: "UNPUBLISHED" },
            },
            headers: {
                "X-Auth-Token": token,
            }
        });

        const responseBody = await response.json();

        testInfo.annotations.push({ type: 'response', description: responseBody });

        expect(responseBody.errors).toBeUndefined();
        expect(responseBody.data?.postQueries?.currentUserFeed?.items).toBeDefined();

    });
});

for (const language of languages) {
    test(`Check if PostsDraftsByUserIdQuery works for ${language}`, async ({ request }, testInfo) => {
        const response = await request.post(apiURL, {
            data: {
                query: PostsDraftsByUserIdQuery,
                variables: { language: language },
            },
            headers: {
                "X-Auth-Token": token,
            }
        });

        const responseBody = await response.json();

        testInfo.annotations.push({ type: 'response', description: responseBody });

        expect(responseBody.errors).toBeUndefined();
        expect(responseBody.data?.postQueries?.currentUserFeed?.items).toBeDefined();

    });
}

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});