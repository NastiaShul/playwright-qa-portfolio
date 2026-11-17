import { test, expect } from "@playwright/test";
import { checkProject, languageForProject} from "../../utils/functions/checkProject";
import { getUsersBlogs } from "./blogQueries";

const apiURL = process.env.API_URL;
let userID = apiURL?.includes("ua") ? "ceac245d-4b36-4c9f-b167-c456a7a80a59" : apiURL?.includes("by") ? "157206849" : "4f90b717-28fe-4fcd-9e7f-947341fcb242";
const project = await checkProject(apiURL);
const languages = await languageForProject(project);


for(const language of languages) {
test(`Check if getUsersBlogs query works for locale ${language}`, async ({ request }, testInfo) => {
    const response = await request.post(apiURL, {
        data: {
            query: getUsersBlogs,
            variables: { userID: userID },
        },
        headers: {"X-language": language}
    });

    const responseBody = await response.json();
    console.log(responseBody);
    
    testInfo.annotations.push({ type: 'response', description: responseBody });

    expect(responseBody.errors).toBeUndefined();
    expect(responseBody.data?.blogsQueries?.ByUser?.items).toBeDefined();
});

}


test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});