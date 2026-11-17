import { test, expect } from "@playwright/test";
import { checkProject } from "../../utils/functions/checkProject";
import { GetPollTags } from "./pollQueries";

const apiURL = process.env.API_URL
const project = await checkProject(apiURL)

if (project === 'INT') {
    test('Check if getPollById query works ', async ({ request }, testInfo) => {
        const variables = {
            "id": "2000000000683"
        }
        const pollResponse = await request.post(apiURL, {
            data: {
                query: GetPollTags,
                variables: variables
            },
            headers: {
                "x-language": "de"
            }
        });
        const pollResponseBody = await pollResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: pollResponseBody
        });

        expect(pollResponseBody.errors).toBeUndefined();
        const pollDataTags = pollResponseBody?.data?.pollQueries?.get?.tags;
        expect(pollDataTags).toBeDefined();
    })
}


test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});