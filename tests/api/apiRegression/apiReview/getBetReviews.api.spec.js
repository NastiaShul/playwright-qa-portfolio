import { test, expect } from "@playwright/test";
import { getBetReviewForWidgetQuery, getBetReviewsQuery } from "./reviewQueries";

const apiURL = process.env.API_URL;


test("Check if getBetReviewForWidget query works", async ({ request }, testInfo) => {
    let language = "en";

    if (apiURL.includes("ua.")) {
        language = "uk";
    } else if (apiURL.includes("by.")) {
        language = "be";
    }

    const reviewHeaders = {
        "x-language": language,
    };

    const reviewVariables = {
        entityId: "64e376606fbc77d433d6ce76",
    };

    const betResponse = await request.post(apiURL, {
        data: {
            query: getBetReviewForWidgetQuery,
            variables: reviewVariables
        },
        headers: reviewHeaders,
    });

    const betResponseBody = await betResponse.json();
    testInfo.annotations.push({ type: 'response', description: betResponseBody });

    expect(betResponseBody.errors).toBeUndefined();
    expect(betResponseBody.data.errors).toBeUndefined();
    expect(betResponseBody.data?.platformQueries?.betReviewQueries?.getBetReviews?.items).toBeDefined();

});

test("Check if getBetReviewsQuery query works", async ({ request }, testInfo) => {
    let language = "en";

    if (apiURL.includes("ua.")) {
        language = "uk";
    } else if (apiURL.includes("by.")) {
        language = "be";
    }

    const reviewHeaders = {
        "x-language": language,
    };

    const reviewVariables = {
        entityID: "652fd56c881014d3a08f82ee"
    };

    const betResponse = await request.post(apiURL, {
        data: {
            query: getBetReviewsQuery,
            variables: {entityID: reviewVariables.entityID}
        },
        headers: reviewHeaders,
    });

    const betResponseBody = await betResponse.json();
    testInfo.annotations.push({ type: 'response', description: betResponseBody });

    expect(betResponseBody.errors).toBeUndefined();
    expect(betResponseBody.data.errors).toBeUndefined();
    expect(betResponseBody.data?.platformQueries?.betReviewQueries?.getBetReviews?.items).toBeDefined();
});

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});
