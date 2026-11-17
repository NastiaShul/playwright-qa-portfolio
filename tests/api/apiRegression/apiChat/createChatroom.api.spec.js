import { test, expect } from '@playwright/test';
import { appsInt, appsUA } from '../../../../src/constants';
import { getAuthToken } from "../../utils/functions/getAuthToken";
import { chatRoomListQuery } from "./chatQueries";
import { createChatroomMutation, deleteChatroomMutation } from "./chatMutations";

const apiURL = process.env.API_URL;
const authToken = getAuthToken().admin.token;

if (apiURL?.includes('by')) {
  test.describe.skip('Chatrooms creation by admin (Skipped for BY)', () => { });
} else {
  const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

  test.describe('Chatrooms creation by admin', () => {
    let createdChatroomId = null;

    selectedApps.forEach(({ name, language }) => {
      test(`Create and verify custom chatroom for app: ${name}, language: ${language}`, async ({ request }) => {
        const chatroomName = `custom_${name}_${Date.now()}`;

        // 1. Створення кімнати
        const createChatroomResponse = await request.post(apiURL, {
          data: {
            query: createChatroomMutation,
            variables: {
              input: {
                name: chatroomName,
                appName: name,
                isPinned: false
              }
            }
          },
          headers: {
            'X-Auth-Token': authToken,
            'X-language': language
          }
        });

        const createChatroomData = await createChatroomResponse.json();
        const createdChatroom = createChatroomData?.data?.adminMutations?.chatMutations?.createChatroom;

        expect(createdChatroom).toBeDefined();
        expect(createdChatroom.name).toBe(chatroomName);
        expect(createdChatroom.type).toBe('CUSTOM');

        createdChatroomId = createdChatroom.id;

        // await expect.poll(async () => {
        //   const chatRoomListResponse = await request.post(apiURL, {
        //     data: {
        //       query: chatRoomListQuery,
        //       variables: { appName: name }
        //     },
        //     headers: {
        //       'X-language': language
        //     }
        //   });

        //   const chatRoomListData = await chatRoomListResponse.json();
        //   const chatrooms = chatRoomListData?.data?.chatQueries?.getChatroomList || [];

        //   return chatrooms.find(
        //     room => room.chatroom?.name === chatroomName && room.chatroom?.type === 'CUSTOM'
        //   );
        // }, {
        //   message: `Chatroom ${chatroomName} was not found in getChatroomList in time`,
        //   timeout: 15000,
        //   intervals: [1000, 2000]
        // }).toBeDefined();
      });
    });

    test.afterEach(async ({ request }) => {
      if (createdChatroomId) {
        const deleteChatroomResponse = await request.post(apiURL, {
          data: {
            query: deleteChatroomMutation,
            variables: {
              id: createdChatroomId
            }
          },
          headers: {
            'X-Auth-Token': authToken
          }
        });

        const deleteChatroomData = await deleteChatroomResponse.json();
        expect(deleteChatroomData?.data?.adminMutations?.chatMutations?.deleteChatroom).toBe(true);

        createdChatroomId = null;
      }
    });
  });
}
