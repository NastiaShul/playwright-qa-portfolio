import { test, expect } from '@playwright/test';
import { appsInt, appsUA } from '../../../../src/constants';
import { chatListQuery, getChatsQuery } from "./chatQueries";

const apiURL = process.env.API_URL;

if (apiURL?.includes('by')) {
  test.describe.skip('Check chatrooms (Skipped for BY)', () => {});
} else {
  const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

test.describe('Check if queries for getting chatrooms in apps work', () => {
  selectedApps.forEach(({ name, language }) => {
    test(`Check chat list in app: ${name}, language: ${language}`, async ({ request }, testInfo) => {
        const chatListResponse = await request.post(apiURL, {
            data: {
                query: chatListQuery,
                variables: { appName: name }
            },
            headers: {
                'x-language': language,
            },
        });
        const chatListResponseBody = await chatListResponse.json();
        testInfo.annotations.push({ type: 'response', description: chatListResponseBody });

        expect(chatListResponseBody.errors).toBeUndefined();
        expect(chatListResponseBody.data.errors).toBeUndefined();
    });
  });
});

test.describe('Check if getChats query works', () => {
  selectedApps.forEach(({ name, language }) => {
    test(`Check get chats in app: ${name}, language: ${language}`, async ({ request }, testInfo) => {
        const chatListResponse = await request.post(apiURL, {
            data: {
                query: getChatsQuery,
                variables: { appName: name }
            },
            headers: {
                'x-language': language,
            },
        });
        const chatListResponseBody = await chatListResponse.json();
        testInfo.annotations.push({ type: 'response', description: chatListResponseBody });

        expect(chatListResponseBody.errors).toBeUndefined();
        expect(chatListResponseBody.data.errors).toBeUndefined();
    });
  });
});
};

test.afterEach(async ({ }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});