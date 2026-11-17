import { test, expect } from "@playwright/test";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { getCurrentUserDiscussionsQuery, CurrentUserDiscussionsQuery}  from "./userQueries.js";

const apiURL = process.env.API_URL;
const token = getAuthToken().user.token;

test("Check if getCurrentUserDiscussionsQuery works", async ({ request }, testInfo) => {
    const response = await request.post(apiURL, {
        data: {
            query: getCurrentUserDiscussionsQuery,
        },
        headers: {
            "X-Auth-Token": token,
        }
    });

    const responseBody = await response.json();

    testInfo.annotations.push({ type: 'response', description: responseBody });

    expect(responseBody.errors).toBeUndefined();
    expect(responseBody.data?.userDiscussionsQueries?.currentUserDiscussions?.feed?.items).toBeDefined();

});

test("Check if CurrentUserDiscussionsQuery works", async ({ request }, testInfo) => {
    const response = await request.post(apiURL, {
        data: {
            query: CurrentUserDiscussionsQuery,
        },
        headers: {
            "X-Auth-Token": token,
        }
    });

    const responseBody = await response.json();

    testInfo.annotations.push({ type: 'response', description: responseBody });

    expect(responseBody.errors).toBeUndefined();
    expect(responseBody.data?.userDiscussionsQueries?.currentUserDiscussions?.feed?.items).toBeDefined();

});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});