import { test, expect } from "@playwright/test";
import { createReviewMutation, removeReviewMutation } from "./reviewMutations";
import { getBetReviewsQuery } from "./reviewQueries";
import { getAuthToken } from "../../utils/functions/getAuthToken";


const apiURL = process.env.API_URL;

let createdReviewId;
let reviewHeaders;
const token = getAuthToken().user.token;

test("Create and verify casino review", async ({ request }) => {
    let language = "en";

    if (apiURL.includes("ua.")) {
        language = "uk";
    } else if (apiURL.includes("by.")) {
        language = "be";
    }

    reviewHeaders = {
        "x-auth-token": token,
        "x-language": language,
        "x-country-code": "ua",
        "x-geoip2-city-country-code": "ukr",
    };

    const reviewVariables = {
        score: 5,
        text: "Exciting casino with a great variety of games, fast withdrawals, and responsive customer support.",
        betPlatformType: "CASINO",
        entityID: "6527dde3f025ecea6d59e06d", // id vbet
    };

    const reviewResponse = await request.post(apiURL, {
        data: { query: createReviewMutation, variables: reviewVariables },
        headers: reviewHeaders,
    });

    const reviewResponseBody = await reviewResponse.json();
    createdReviewId = reviewResponseBody.data.platformMutations.betReviewMutations.createReview.id;
    expect(createdReviewId).toBeDefined();

    await expect.poll(async () => {
        const reviewsResponse = await request.post(apiURL, {
            data: { query: getBetReviewsQuery, variables: { entityID: reviewVariables.entityID } },
            headers: reviewHeaders,
        });

        const reviewsResponseBody = await reviewsResponse.json();
        const reviews = reviewsResponseBody.data.platformQueries?.betReviewQueries?.getBetReviews?.items || [];

        return reviews.some((review) => review.id === createdReviewId);
    }, { timeout: 10000, intervals: [500] }).toBe(true);
});

test.afterEach(async ({ request }) => {
    if (createdReviewId) {
        const removeResponse = await request.post(apiURL, {
            data: { query: removeReviewMutation, variables: { id: createdReviewId } },
            headers: reviewHeaders,
        });

        const removeResponseBody = await removeResponse.json();
        expect(removeResponseBody.data.platformMutations.betReviewMutations.removeReview).toBe(true);
    }
});