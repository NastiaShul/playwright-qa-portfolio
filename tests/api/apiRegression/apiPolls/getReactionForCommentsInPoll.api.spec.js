import { test, expect } from "@playwright/test";
import { getReactionForCommentsInPollQuery } from "./pollQueries";


const apiURL = process.env.API_URL;
const pollId = apiURL?.includes('ua.') ? '2000000000066'
  : apiURL?.includes('by.') ? '2000000000004' : '2000000000339';

  test("Check if getReactionForCommentsInPoll query works", async ({ request }, testInfo) => {
    const response = await request.post(apiURL, {
        data: {
            query: getReactionForCommentsInPollQuery,
            variables: { pollHruOrId: pollId }
        },
    });
    const responseBody = await response.json();
    testInfo.annotations.push({ type: 'response', description: responseBody });

    expect(responseBody.errors).toBeUndefined();
    expect(responseBody.data.errors).toBeUndefined();

  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});