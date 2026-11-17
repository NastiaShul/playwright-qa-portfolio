import { test, expect } from "@playwright/test";
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { PostPollListQuery } from "./pollQueries";

const apiURL = process.env.API_URL
const project = await checkProject(apiURL)
const languages = await languageForProject(project)

test('Check if PostPollListQuery query works ', async ({ request }, testInfo) => {
    for (let language of languages) {
        const variables = {
            "isMain": true,
            "page": 2,
            "pageSize": 10
        }
        const pollResponse = await request.post(apiURL, {
            data: {
                query: PostPollListQuery,
                variables: variables
            },
            headers: {
                'x-language': language,
            },
        });
        const pollResponseBody = await pollResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: pollResponseBody
        });

        expect(pollResponseBody.errors).toBeUndefined();
        const pollData = pollResponseBody?.data?.feedQueries?.feedPAL?.items;
        expect(pollData).toBeDefined();
    }
})


test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});