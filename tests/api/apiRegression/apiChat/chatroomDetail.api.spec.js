import { test, expect } from '@playwright/test';
import { appsInt, appsUA } from '../../../../src/constants';
import { chatRoomListQuery, GetChatRoomQuery, ChatroomDetailHistoryUpwardsQuery } from "./chatQueries";

const apiURL = process.env.API_URL;
const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

if (apiURL?.includes('by')) {
    test.describe.skip('Send a message to chatroom (Skipped for BY)', () => { });
} else {
    test.describe('Check if GetChatRoomQuery query works', () => {
        selectedApps.forEach(({ name, language }) => {
            test(`Check if GetChatRoomQuery query works in app: ${name} chatrooms, language: ${language}`, async ({ request }, testInfo) => {
                const chatRoomsResponse = await request.post(apiURL, {
                    data: {
                        query: chatRoomListQuery,
                        variables: { appName: name },
                    },
                    headers: {
                        'X-language': language
                    }
                });

                const chatRoomsData = await chatRoomsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: chatRoomsResponse
                });

                const chatrooms = chatRoomsData?.data?.chatQueries?.getChatroomList || [];
                const firstChatRoom = chatrooms[0]?.chatroom;
                expect(firstChatRoom).toBeDefined();
                const chatID = firstChatRoom.id;

                const getChatroomResponse = await request.post(apiURL, {
                    data: {
                        query: GetChatRoomQuery,
                        variables: { id: chatID },
                    },
                    headers: {
                        'X-language': language
                    }
                });
                const getChatroomData = await getChatroomResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: getChatroomData
                });

                expect(getChatroomData.errors).toBeUndefined();
                const getChatroom = getChatroomData?.data?.chatQueries?.getChatroom;
                expect(getChatroom).toBeDefined();

            });
        });
    });

    test.describe('Check if ChatroomDetailHistoryUpwardsQuery query works', () => {
        selectedApps.forEach(({ name, language }) => {
            test(`Check if ChatroomDetailHistoryUpwardsQuery query works in app: ${name} chatrooms, language: ${language}`, async ({ request }, testInfo) => {
                const chatRoomsResponse = await request.post(apiURL, {
                    data: {
                        query: chatRoomListQuery,
                        variables: { appName: name },
                    },
                    headers: {
                        'X-language': language
                    }
                });

                const chatRoomsData = await chatRoomsResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: chatRoomsResponse
                });

                const chatrooms = chatRoomsData?.data?.chatQueries?.getChatroomList || [];
                const firstChatRoom = chatrooms[0]?.chatroom;
                expect(firstChatRoom).toBeDefined();
                const chatID = firstChatRoom.id;

                const getChatroomResponse = await request.post(apiURL, {
                    data: {
                        query: ChatroomDetailHistoryUpwardsQuery,
                        variables: { chatId: chatID },
                    },
                    headers: {
                        'X-language': language
                    }
                });
                const getChatroomData = await getChatroomResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: getChatroomData
                });

                expect(getChatroomData.errors).toBeUndefined();
                expect(getChatroomData?.data?.chatQueries?.historyMessages?.items).toBeDefined();

            });
        });
    });
}