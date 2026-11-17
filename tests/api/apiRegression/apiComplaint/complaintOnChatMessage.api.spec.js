import { test, expect } from '@playwright/test';
import { appsInt, appsUA } from '../../../../src/constants';
import { chatRoomListQuery, getMessageHistoryQuery } from "../apiChat/chatQueries";
import { complaintsListQuery } from "./complaintQueries";
import { createComplaintMutation } from "./complaintMutations";
import { getAuthToken } from "../../utils/functions/getAuthToken";

const apiURL = process.env.API_URL;
const authToken = getAuthToken().admin.token;

if (apiURL?.includes('by')) {
  test.describe.skip('Open the complaint on the message (Skipped for BY)', () => {});
} else {
  const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

test.describe('Open the complaint on the message', () => {

  selectedApps.forEach(({ name, language }) => {
    test(`Report message in app: ${name}, language: ${language}`, async ({ request }) => {
      const headers = {
        'X-language': language,
        'X-Auth-Token': authToken,
      };
      if (selectedApps === appsInt) {
        headers['X-SportsApp-App'] = name;
      }

      const chatRoomsResponse = await request.post(apiURL, {
        data: {
          query: chatRoomListQuery,
          variables: { appName: name },
        },
        headers,
      });

      const chatRoomsData = await chatRoomsResponse.json();
      const chatrooms = chatRoomsData?.data?.chatQueries?.getChatroomList || [];
      expect(chatrooms.length).toBeGreaterThan(0);

      let complaintCreated = false;
      let createdComplaintText = "";

      for (const room of chatrooms) {
        const { id: chatID } = room?.chatroom;
        expect(chatID).toBeDefined();

        const getMessageHistoryResponse = await request.post(apiURL, {
          data: {
            query: getMessageHistoryQuery,
            variables: { chatID },
          },
          headers,
        });

        const getMessageHistoryData = await getMessageHistoryResponse.json();
        const messages = getMessageHistoryData?.data?.chatQueries?.historyMessages?.items || [];
        
        if (messages.length > 0) {
          const firstMessage = messages[0];
          const { id: messageId, text: messageText } = firstMessage;
          expect(messageId).toBeDefined();

          const createComplaintResponse = await request.post(apiURL, {
            data: {
              query: createComplaintMutation,
              variables: {
                id: firstMessage.id,
                objectClass: "CHATMESSAGE",
                parentId: chatID,
                parentObjectClass: "CHATROOM",
              },
            },
            headers,
          });

          const createComplaintData = await createComplaintResponse.json();
          const complaint = createComplaintData?.data?.complaintsMutations?.createComplaint;

          expect(complaint).toBeDefined();
          expect(complaint.status).toBe("OPEN");
          expect(complaint.text).toBe(messageText);

          createdComplaintText = complaint.text;
          complaintCreated = true;
          break;
        }
      }
      expect(complaintCreated).toBeTruthy();

      const complaintsResponse = await request.post(apiURL, {
        data: {
          query: complaintsListQuery,
          variables: {
            objectClass: "CHATMESSAGE"
          }
        },
        headers: headers
      });

      const complaintsData = await complaintsResponse.json();
      const complaints = complaintsData?.data?.complaintsQueries?.feed?.list || [];
      expect(complaints.length).toBeGreaterThan(0);

      const foundComplaint = complaints.find(complaint => complaint.text === createdComplaintText);
      expect(foundComplaint).toBeDefined();
      expect(foundComplaint.status).toBe("OPEN");
    });
  });
});
}