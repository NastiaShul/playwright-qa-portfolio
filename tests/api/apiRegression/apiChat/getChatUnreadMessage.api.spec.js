import { test, expect } from '@playwright/test';
import { appsInt, appsUA } from '../../../../src/constants';
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { chatRoomListQuery,  getChatUnreadMessagesCountQuery, getChatListUnreadMessagesQuery} from "./chatQueries";

const apiURL = process.env.API_URL;
const token = await getAuthToken().user.token;

if (apiURL?.includes('by')) {
    test.describe.skip('Check if GetChatUnreadMessagesCount queries works in chats (Skipped for BY)', () => { });
} else {
    const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

    test.describe('Check if GetChatUnreadMessagesCount queries works in chats', () => {

        selectedApps.forEach(({ name, language }) => {
            test(`Check if GetChatUnreadMessagesCount queries works in chats in app: ${name}, language: ${language}`, async ({ request }, testInfo) => {

                const chatRoomsResponse = await request.post(apiURL, {
                    data: {
                        query: chatRoomListQuery,
                        variables: { appName: name },
                    },
                    headers: {
                        'X-Auth-Token': token,
                        'X-language': language
                    }
                });

                const chatRoomsData = await chatRoomsResponse.json();
                const chatrooms = chatRoomsData?.data?.chatQueries?.getChatroomList || [];
                expect(chatrooms.length).toBeGreaterThan(0);

                const firstChatRoom = chatrooms[0]?.chatroom;
                expect(firstChatRoom).toBeDefined();
                const chatID = firstChatRoom.id;

                const getChatRoomsResponse = await request.post(apiURL, {
                    data: {
                        query: getChatUnreadMessagesCountQuery,
                        variables: { entityID: chatID},
                    },
                    headers: {
                        'X-language': language
                    }
                });

                const getChatRoomsResponseDate = await getChatRoomsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: chatRoomsResponse
                });

                expect(getChatRoomsResponseDate.errors).toBeUndefined();
                const getChatRooms = getChatRoomsResponseDate?.data?.chatQueries?.unreadMessagesCount || null;
                expect(getChatRooms).toBeDefined();
            });

        });
    });
}

if (apiURL?.includes('by')) {
    test.describe.skip('Check if getChatListUnreadMessages queries works in chats (Skipped for BY)', () => { });
} else {
    const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

    test.describe('Check if getChatListUnreadMessages queries works in chats', () => {

        selectedApps.forEach(({ name, language }) => {
            test(`Check if getChatListUnreadMessages queries works in chats in app: ${name}, language: ${language}`, async ({ request }, testInfo) => {

                const getChatRoomsResponse = await request.post(apiURL, {
                    data: {
                        query: getChatListUnreadMessagesQuery,
                        variables: { appName: name},
                    },
                    headers: {
                        'X-Auth-Token': token,
                        'X-language': language
                    }
                });

                const getChatRoomsResponseDate = await getChatRoomsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: getChatRoomsResponseDate
                });

                expect(getChatRoomsResponseDate.errors).toBeUndefined();
                const getChatRooms = getChatRoomsResponseDate?.data?.chatQueries?.getChatroomList;
                expect(getChatRooms).toBeDefined();
                const firstChatRoomMessase = getChatRooms[0]?.firstUnreadMessage;
                expect(firstChatRoomMessase).toBeDefined();
            });

        });
    });
}

test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});