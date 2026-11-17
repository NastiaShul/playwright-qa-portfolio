import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import {
    fetchFirstNewsId,
    createCommentFunc,
    contentVariables,
    adminDeleteCommentFunc
} from "../../utils/functions/commentFunctions.js";
import { getComments } from "./commentQueries.js";
import { checkProject } from "../../utils/functions/checkProject";
import { appsInt } from "../../../../src/constants.js";

const apiURL = process.env.API_URL;

const project = await checkProject(apiURL);
const token = getAuthToken().admin.token;

let headers = {};
let phantomUserId = project === "UA" ? "fd403d7d-1011-4aae-b98b-62c806760b42" : "e2ab7801-f6e7-45be-bc43-3c43835e90e2";

if (project === "UA" || project === "INT") {
    let language = project === "UA" ? "uk" : "en";

    test("Create a comment and verify phantom user", async ({ request }, testInfo) => {
        headers = {
            "X-Auth-Token": token,
            "X-Language": language,
        };

        const firstNewsId = await fetchFirstNewsId(request, apiURL, headers);
        contentVariables.objectId = firstNewsId;

        let createdCommentId;

        try {
            createdCommentId = await createCommentFunc(request, apiURL, headers, {
                userId: phantomUserId,
                text: `phantom commentText ${faker.random.alpha(4)}`
            });

            await expect.poll(async () => {
                const response = await request.post(apiURL, {
                    data: { query: getComments, variables: contentVariables },
                    headers
                });
                const body = await response.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: body
                });
                return body.data.commentsQueries.feed.items.some(c => c.id === createdCommentId);
            }, {
                timeout: 5000,
                interval: 500
            }).toBe(true);

        } finally {
            if (createdCommentId) {
                await adminDeleteCommentFunc(request, apiURL, headers, createdCommentId);
            }
        }
    });
}

if (project === "INT") {
    appsInt.forEach(({ name, language }) => {

        test(`Create a comment and verify phantom user for app ${name} ${language}`, async ({ request }, testInfo) => {
            const headers = {
                "X-Auth-Token": token,
                "X-Language": language,
            };

            const firstNewsId = await fetchFirstNewsId(request, apiURL, headers);
            contentVariables.objectId = firstNewsId;

            let createdCommentId;

            try {
                createdCommentId = await createCommentFunc(request, apiURL, headers, {
                    userId: phantomUserId,
                    appName: name,
                    text: `phantom commentText ${name} ${language} ${faker.random.alpha()}`
                });

                await expect.poll(async () => {
                    const response = await request.post(apiURL, {
                        data: { query: getComments, variables: contentVariables },
                        headers
                    });
                    const body = await response.json();
                    testInfo.annotations.push({
                        type: 'response',
                        description: body
                    });
                    return body.data.commentsQueries.feed.items.some(c => c.id === createdCommentId);
                }, {
                    timeout: 5000,
                    interval: 500
                }).toBe(true);

            } finally {
                if (createdCommentId) {
                    await adminDeleteCommentFunc(request, apiURL, headers, createdCommentId);
                }
            }
        });

    });
}

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});