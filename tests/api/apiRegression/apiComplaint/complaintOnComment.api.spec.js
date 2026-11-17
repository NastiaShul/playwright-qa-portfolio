import { test, expect } from "@playwright/test";
import { fetchNewsWithCommentsQuery } from "../../apiRegression/apiNews/newsQuery";
import { complaintsListQuery } from "./complaintQueries";
import { createComplaintMutation } from "./complaintMutations";
import { getAuthToken } from "../../utils/functions/getAuthToken";

const apiURL = process.env.API_URL;

test.describe("Open the complaint on the comment", () => {
    test.skip(!apiURL?.includes("ua"));

    const authToken = getAuthToken().admin.token;
    let headers = { authToken };
    
    test.beforeEach(async ({ request }, testInfo) => {
        if (apiURL.includes("ua.")) {
            headers["X-language"] = "uk";
        }
    });

    test.skip("Open the complaint on the comment", async ({ request }, testInfo) => {
        const newsResponse = await request.post(apiURL, {
            data: { query: fetchNewsWithCommentsQuery },
            headers,
        });

        const newsResponseBody = await newsResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: newsResponseBody
        });

        const newsItems = newsResponseBody.data.newsQueries.feed.items;

        let createdComplaintText = "";
        let complaintCreated = false;

        for (const news of newsItems) {
            const { id: newsId, topLevelComments } = news;

            if (topLevelComments.items.length > 0) {
                const firstComment = topLevelComments.items[0];
                const commentText = firstComment.text;

                if (commentText && commentText.trim().length > 0) {
                    const complaintResponse = await request.post(apiURL, {
                        data: {
                            query: createComplaintMutation,
                            variables: {
                                id: firstComment.id,
                                parentId: newsId,
                                objectClass: "COMMENT",
                                parentObjectClass: "NEWS",
                            },
                        },
                        headers,
                    });

                    const complaintResponseBody = await complaintResponse.json();
                    testInfo.annotations.push({
                        type: 'response',
                        description: complaintResponseBody
                    });

                    const complaint = complaintResponseBody.data.complaintsMutations.createComplaint;

                    expect(complaint).toBeDefined();
                    expect(complaint.status).toBe("OPEN");
                    expect(complaint.text).toBe(commentText);

                    createdComplaintText = complaint.text;
                    complaintCreated = true;
                    break;
                }
            }
        }

        expect(complaintCreated).toBeTruthy();

        const complaintsResponse = await request.post(apiURL, {
            data: {
                query: complaintsListQuery,
                variables: {
                    objectClass: "COMMENT",
                    status: "OPEN",
                },
            },
            headers
        });

        const complaintsData = await complaintsResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: complaintsData
        });
        
        const complaints = complaintsData.data.complaintsQueries.feed.list || [];
        expect(complaints.length).toBeGreaterThan(0);

        const foundComplaint = complaints.find((complaint) => complaint.text === createdComplaintText);
        expect(foundComplaint).toBeDefined();
        expect(foundComplaint.status).toBe("OPEN");
    });
});
