import { test, expect } from '@playwright/test';
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { chatRoomListQuery, getChatMessagesQuery, getChatroomByEntityIDQuery, GetChatMessagesByAnchorIdQuery, getChatMiddleMessagesQuery, getChatroomDetailMiddleQuery } from "./chatQueries";
import { matchesUpcomingQuery } from "../apiMatch/matchQueries";
import { appsInt, appsUA } from '../../../../src/constants';

const apiURL = process.env.API_URL;
const project = await checkProject(apiURL);
const languages = await languageForProject(project);

if (apiURL?.includes('by')) {
    test.describe.skip('Send a message to chatroom (Skipped for BY)', () => { });
} else {
    const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

    test.describe('Check if GetChatMessages query works', () => {
        selectedApps.forEach(({ name, language }) => {
            test(`Check if GetChatMessages query works in app: ${name} chatrooms, language: ${language}`, async ({ request }, testInfo) => {
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

                const chatMessagesResponse = await request.post(apiURL, {
                    data: {
                        query: getChatMessagesQuery,
                        variables: { chatID: chatID },
                    },
                    headers: {
                        'X-language': language
                    }
                });
                const chatMessagesData = await chatMessagesResponse.json();
                testInfo.annotations.push({
                    type: 'response',
                    description: chatMessagesData
                });

                expect(chatMessagesData.errors).toBeUndefined();
                const historyMessages = chatMessagesData?.data?.chatQueries?.historyMessages;
                expect(historyMessages).toBeDefined();

                const pagination = historyMessages.pagination;
                expect(pagination).toBeDefined();
                expect(typeof pagination).toBe('object');
                expect(pagination.__typename).toBe('PaginationByCursor');
                expect(pagination.endCursor).toBeDefined();
                expect(typeof pagination.endCursor).toBe('string');
                expect(pagination.startCursor).toBeDefined();
                expect(typeof pagination.startCursor).toBe('string');
                expect(pagination.totalItemsCount).toBeDefined();
                expect(typeof pagination.totalItemsCount === 'number' || pagination.totalItemsCount === null).toBe(true);
                expect(pagination.hasNextPage).toBeDefined();
                expect(typeof pagination.hasNextPage).toBe('boolean');
                expect(pagination.hasPrevPage).toBeDefined();
                expect(typeof pagination.hasPrevPage).toBe('boolean');

                const chatMessages = chatMessagesData?.data?.chatQueries?.historyMessages?.items || [];
                expect(chatMessages).toBeDefined();
                expect(Array.isArray(chatMessages)).toBe(true);
                if (chatMessages.length > 0) {
                    chatMessages.forEach(message => {
                        expect(message).toBeDefined();
                        expect(typeof message).toBe('object');
                        expect(message.__typename).toBe('Message');
                        expect(message.id).toBeDefined();
                        expect(typeof message.id).toBe('string');
                        expect(message.text).toBeDefined();
                        expect(typeof message.text === 'string' || message.text === null).toBe(true);
                        expect(message.createdAt).toBeDefined();
                        expect(typeof message.createdAt).toBe('number');
                        expect(message.isDeleted).toBeDefined();
                        expect(typeof message.isDeleted).toBe('boolean');
                        expect(message.isRead).toBeDefined();
                        expect(typeof message.isRead).toBe('boolean');

                        const user = message.user;
                        expect(user).toBeDefined();
                        expect(typeof user).toBe('object');
                        expect(user.id).toBeDefined();
                        expect(typeof user.id).toBe('string');
                        expect(user.name).toBeDefined();
                        expect(typeof user.name === 'string' || user.name === null).toBe(true);
                        expect(user.avatar).toBeDefined();
                        expect(typeof user.avatar === 'object' || user.avatar === null).toBe(true);
                        if (user.avatar !== null) {
                            expect(user.avatar.url).toBeDefined();
                            expect(typeof user.avatar.url === 'string' || user.avatar.url === null).toBe(true);
                        }
                        expect(user.hasActiveSubscription).toBeDefined();
                        expect(typeof user.hasActiveSubscription === 'boolean' || user.hasActiveSubscription === null).toBe(true);

                        expect(message.parentMessage).toBeDefined();
                        expect(typeof message.parentMessage === 'object' || message.parentMessage === null).toBe(true);
                        if (message.parentMessage !== null) {
                            expect(message.parentMessage.id).toBeDefined();
                            expect(typeof message.parentMessage.id).toBe('string');
                            expect(message.parentMessage.text).toBeDefined();
                            expect(typeof message.parentMessage.text === 'string' || message.parentMessage.text === null).toBe(true);
                            expect(message.parentMessage.isDeleted).toBeDefined();
                            expect(typeof message.parentMessage.isDeleted).toBe('boolean');

                            const parentUser = message.parentMessage.user;
                            expect(parentUser).toBeDefined();
                            expect(typeof parentUser).toBe('object');
                            expect(parentUser.name).toBeDefined();
                            expect(typeof parentUser.name === 'string' || parentUser.name === null).toBe(true);
                            expect(parentUser.hasActiveSubscription).toBeDefined();
                            expect(typeof parentUser.hasActiveSubscription === 'boolean' || parentUser.hasActiveSubscription === null).toBe(true);
                        }
                    });
                }

            });
        });
    });
}

test('Check if GetChatMessages query works in match chatrooms', async ({ request }, testInfo) => {
    for (let language of languages) {
        const matchesResponse = await request.post(apiURL, {
            data: {
                query: matchesUpcomingQuery,
            },
        });

        const matchesData = await matchesResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: matchesResponse
        });
        const matches = matchesData?.data?.stat_matchesUpcoming?.matches || [];
        expect(matches).toBeDefined();
        expect(Array.isArray(matches)).toBe(true);

        const matchID = matches[0].id;

        const matchChatroomResponse = await request.post(apiURL, {
            data: {
                query: getChatroomByEntityIDQuery,
                variables: { entityID: matchID },
            },
            headers: {
                'X-language': language
            }
        });
        const matchChatroomData = await matchChatroomResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: matchChatroomData
        });
        expect(matchChatroomData.errors).toBeUndefined();
        const chatID = matchChatroomData?.data?.chatQueries?.getChatroomByEntityID?.chatroom.id;

        const chatMessagesResponse = await request.post(apiURL, {
            data: {
                query: getChatMessagesQuery,
                variables: { chatID: chatID },
            },
            headers: {
                'X-language': language
            }
        });
        const chatMessagesData = await chatMessagesResponse.json();
        testInfo.annotations.push({
            type: 'response',
            description: chatMessagesData
        });

        expect(chatMessagesData.errors).toBeUndefined();
        const historyMessages = chatMessagesData?.data?.chatQueries?.historyMessages;
        expect(historyMessages).toBeDefined();

        const pagination = historyMessages.pagination;
        expect(pagination).toBeDefined();
        expect(typeof pagination).toBe('object');
        expect(pagination.__typename).toBe('PaginationByCursor');
        expect(pagination.endCursor).toBeDefined();
        expect(typeof pagination.endCursor).toBe('string');
        expect(pagination.startCursor).toBeDefined();
        expect(typeof pagination.startCursor).toBe('string');
        expect(pagination.totalItemsCount).toBeDefined();
        expect(typeof pagination.totalItemsCount === 'number' || pagination.totalItemsCount === null).toBe(true);
        expect(pagination.hasNextPage).toBeDefined();
        expect(typeof pagination.hasNextPage).toBe('boolean');
        expect(pagination.hasPrevPage).toBeDefined();
        expect(typeof pagination.hasPrevPage).toBe('boolean');

        const chatMessages = chatMessagesData?.data?.chatQueries?.historyMessages?.items || [];
        expect(chatMessages).toBeDefined();
        expect(Array.isArray(chatMessages)).toBe(true);
        if (chatMessages.length > 0) {
            chatMessages.forEach(message => {
                expect(message).toBeDefined();
                expect(typeof message).toBe('object');
                expect(message.__typename).toBe('Message');
                expect(message.id).toBeDefined();
                expect(typeof message.id).toBe('string');
                expect(message.text).toBeDefined();
                expect(typeof message.text === 'string' || message.text === null).toBe(true);
                expect(message.createdAt).toBeDefined();
                expect(typeof message.createdAt).toBe('number');
                expect(message.isDeleted).toBeDefined();
                expect(typeof message.isDeleted).toBe('boolean');
                expect(message.isRead).toBeDefined();
                expect(typeof message.isRead).toBe('boolean');

                const user = message.user;
                expect(user).toBeDefined();
                expect(typeof user).toBe('object');
                expect(user.id).toBeDefined();
                expect(typeof user.id).toBe('string');
                expect(user.name).toBeDefined();
                expect(typeof user.name === 'string' || user.name === null).toBe(true);
                expect(user.avatar).toBeDefined();
                expect(typeof user.avatar === 'object' || user.avatar === null).toBe(true);
                if (user.avatar !== null) {
                    expect(user.avatar.url).toBeDefined();
                    expect(typeof user.avatar.url === 'string' || user.avatar.url === null).toBe(true);
                }
                expect(user.hasActiveSubscription).toBeDefined();
                expect(typeof user.hasActiveSubscription === 'boolean' || user.hasActiveSubscription === null).toBe(true);

                expect(message.parentMessage).toBeDefined();
                expect(typeof message.parentMessage === 'object' || message.parentMessage === null).toBe(true);
                if (message.parentMessage !== null) {
                    expect(message.parentMessage.id).toBeDefined();
                    expect(typeof message.parentMessage.id).toBe('string');
                    expect(message.parentMessage.text).toBeDefined();
                    expect(typeof message.parentMessage.text === 'string' || message.parentMessage.text === null).toBe(true);
                    expect(message.parentMessage.isDeleted).toBeDefined();
                    expect(typeof message.parentMessage.isDeleted).toBe('boolean');

                    const parentUser = message.parentMessage.user;
                    expect(parentUser).toBeDefined();
                    expect(typeof parentUser).toBe('object');
                    expect(parentUser.name).toBeDefined();
                    expect(typeof parentUser.name === 'string' || parentUser.name === null).toBe(true);
                    expect(parentUser.hasActiveSubscription).toBeDefined();
                    expect(typeof parentUser.hasActiveSubscription === 'boolean' || parentUser.hasActiveSubscription === null).toBe(true);
                }
            });
        }
    }
});

if (apiURL?.includes('by') || apiURL?.includes('ua')) {
    test.describe.skip('GetChatMessagesByAnchorIdQuery (Skipped for UA&BY)', () => { });
} else {
    test(`Check if GetChatMessagesByAnchorIdQuery works`, async ({ request }, testInfo) => {
        const variables = {
            "input": {
                "afterCount": 2,
                "beforeCount": 2,
                "chatID": "133",
                "id": "509233"
            }
        }
        const response = await request.post(apiURL, {
            data: {
                query: GetChatMessagesByAnchorIdQuery,
                variables,
            }
        });

        const responseData = await response.json();
        testInfo.annotations.push({
            type: 'response',
            description: responseData
        });

        expect(responseData.errors).toBeUndefined();
        expect(responseData?.data?.chatQueries?.middleMessages?.items).toBeDefined();
    });
}


if (apiURL?.includes('by')) {
    test.skip('GetChatMiddleMessages (Skipped for BY)', async () => { });
} else {
    test('Check if GetChatMiddleMessages works', async ({ request }, testInfo) => {
        const response = await request.post(apiURL, {
            data: {
                query: getChatMiddleMessagesQuery,
                variables: {
                    id: apiURL?.includes('ua') ? "4857" : "548081",
                    chatID: apiURL?.includes('ua') ? "2844076" : "5"
                },
            },
        });

        const responseData = await response.json();
        testInfo.annotations.push({
            type: 'response',
            description: JSON.stringify(responseData),
        });

        expect(responseData.errors).toBeUndefined();
        expect(responseData?.data?.chatQueries?.middleMessages?.items).toBeDefined();
    });
}

if (apiURL?.includes('by')) {
    test.skip('getChatroomDetailMiddleQuery (Skipped for BY)', async () => { });
} else {
    test('Check if getChatroomDetailMiddleQuery works', async ({ request }, testInfo) => {
        const response = await request.post(apiURL, {
            data: {
                query: getChatroomDetailMiddleQuery,
                variables: {
                    middleId: apiURL?.includes('ua') ? "4857" : "548275",
                    chatId: apiURL?.includes('ua') ? "2844076" : "37"
                },
            },
        });

        const responseData = await response.json();
        testInfo.annotations.push({
            type: 'response',
            description: JSON.stringify(responseData),
        });

        expect(responseData.errors).toBeUndefined();
        expect(responseData?.data?.chatQueries?.middleMessages?.items).toBeDefined();
    });
}

test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});