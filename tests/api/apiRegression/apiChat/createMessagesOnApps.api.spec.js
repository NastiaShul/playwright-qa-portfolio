import { test, expect } from '@playwright/test';
import { faker } from "@faker-js/faker";
import { appsInt, appsUA } from '../../../../src/constants';
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { chatRoomListQuery, getMessageHistoryQuery } from "./chatQueries.js";
import { createMessageMutation, deleteMessageMutation } from "./chatMutations.js";

const apiURL = process.env.API_URL;
const token = await getAuthToken().user.token;

if (apiURL?.includes('by')) {
  test.describe.skip('Send a message to chatroom (Skipped for BY)', () => { });
} else {
  const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

  test.describe('Send a message to chatroom', () => {
    let createdMessageID = null;

    selectedApps.forEach(({ name, language }) => {
      test(`Send and verify message in app: ${name}, language: ${language}`, async ({ request }) => {
        const messageText = `Test message for ${name} at ${faker.random.alpha(5)}}`;

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
        const chatrooms = chatRoomsData?.data?.chatQueries?.getChatroomList || [];
        expect(chatrooms.length).toBeGreaterThan(0);

        const firstChatRoom = chatrooms[0]?.chatroom;
        expect(firstChatRoom).toBeDefined();
        const chatID = firstChatRoom.id;

        const createMessageResponse = await request.post(apiURL, {
          data: {
            query: createMessageMutation,
            variables: {
              chatID: chatID,
              text: messageText,
            },
          },
          headers: {
            'X-Auth-Token': token,
            'X-language': language
          }
        });

        const createMessageData = await createMessageResponse.json();
        const createdMessage = createMessageData?.data?.chatMutations?.createMessage;

        expect(createdMessage).toBeDefined();
        expect(createdMessage.chatID).toBe(chatID);
        expect(createdMessage.text).toBe(messageText);

        createdMessageID = createdMessage.id;

        const getMessageHistoryResponse = await request.post(apiURL, {
          data: {
            query: getMessageHistoryQuery,
            variables: { chatID },
          },
          headers: {
            'X-language': language
          }
        });

        const getMessageHistoryData = await getMessageHistoryResponse.json();
        const messages = getMessageHistoryData?.data?.chatQueries?.historyMessages?.items || [];

        const foundMessage = messages.find(msg => msg.text === messageText);
        expect(foundMessage).toBeDefined();
        expect(foundMessage.text).toBe(messageText);
      });

      test.afterEach(async ({ request }) => {
        if (createdMessageID) {
          const deleteMessageResponse = await request.post(apiURL, {
            data: {
              query: deleteMessageMutation,
              variables: { id: createdMessageID },
            },
            headers: {
              'X-Auth-Token': token,
              'X-language': language
            }
          });

          const deleteMessageData = await deleteMessageResponse.json();
          expect(deleteMessageData?.data?.chatMutations?.deleteMessage).toBe(true);

          createdMessageID = null;
        }
      });
    });
  });
}