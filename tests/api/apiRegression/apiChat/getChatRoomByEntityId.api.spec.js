import { test, expect } from '@playwright/test';
import { checkProject, languageForProject } from "../../utils/functions/checkProject";
import { getChatroomByEntityIDQuery , getChatByEntityIdQuery} from "./chatQueries";
import { matchesUpcomingQuery } from "../apiMatch/matchQueries";

const apiURL = process.env.API_URL;
const project = await checkProject(apiURL);
const languages = await languageForProject(project);

test('Check if GetChatRoomByEntityID query works in match chatrooms', async ({ request }, testInfo) => {
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
        const matchChatroom = matchChatroomData?.data?.chatQueries?.getChatroomByEntityID;
        expect(matchChatroom.chattyUsers).toBeDefined();
        expect(Array.isArray(matchChatroom.chattyUsers)).toBe(true);
        expect(matchChatroom.firstUnreadMessage).toBeDefined();
        expect(matchChatroom.lastMessage).toBeDefined();
        expect(matchChatroom.unreadMessagesCount).toBeDefined();

        const chatRoom = matchChatroomData?.data?.chatQueries?.getChatroomByEntityID?.chatroom;
        expect(chatRoom).toBeDefined();
        expect(typeof chatRoom).toBe('object');
        expect(chatRoom.id).toBeDefined();
        expect(typeof chatRoom.id).toBe('string');
        expect(chatRoom.name).toBeDefined();
        expect(typeof chatRoom.name).toBe('string');
        expect(chatRoom.isPinned).toBeDefined();
        expect(typeof chatRoom.isPinned).toBe('boolean');
        expect(chatRoom.logos).toBeDefined();
        expect(Array.isArray(chatRoom.logos)).toBe(true);
    }
});

test('Check if GetChatRoomByEntityId query works in match chatrooms', async ({ request }, testInfo) => {
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
                query: getChatByEntityIdQuery,
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
        const matchChatroom = matchChatroomData?.data?.chatQueries?.getChatroomByEntityID;
        expect(matchChatroom.firstUnreadMessage).toBeDefined();
        expect(matchChatroom.chatroom).toBeDefined();
    }
});