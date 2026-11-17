import { test, expect } from '@playwright/test';
import { appsInt, appsUA } from '../../../../src/constants';
import { getMatchesQuery } from "../apiMatch/matchQueries";
import { chatRoomListQuery } from "./chatQueries";

const apiURL = process.env.API_URL;

function isMatchRelevant(matchDate) {
  const today = new Date();
  const matchDateObj = new Date(matchDate);

  const twoDaysBefore = new Date(matchDateObj);
  twoDaysBefore.setDate(matchDateObj.getDate() - 2);

  const oneDayAfter = new Date(matchDateObj);
  oneDayAfter.setDate(matchDateObj.getDate() + 1);

  return today >= twoDaysBefore && today <= oneDayAfter;
};

function normalizeToArray(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') return [data];
  return [];
}

if (apiURL?.includes('by')) {
  test.describe.skip('Chatroom verification for matches (Skipped for BY)', () => { });
} else {
  const selectedApps = apiURL?.includes('ua') ? appsUA : appsInt;

  test.describe.skip('Chatroom verification for matches', () => {
    selectedApps.forEach(({ name, id, language }) => {
      test(`Verify chatrooms for matches in app: ${name}, language: ${language}`, async ({ request }) => {
        const matchesResponse = await request.post(apiURL, {
          data: {
            query: getMatchesQuery,
            variables: { teamId: id },
          }
        });

        const matchesData = await matchesResponse.json();
        const pastMatches = normalizeToArray(matchesData?.data?.stat?.football?.stat_team?.teaser?.last);
        const upcomingMatches = normalizeToArray(matchesData?.data?.stat?.football?.stat_team?.teaser?.next);
        const currentMatches = normalizeToArray(matchesData?.data?.stat?.football?.stat_team?.teaser?.current);

        const allRelevantMatches = [
          ...pastMatches,
          ...upcomingMatches,
          ...currentMatches,
        ].filter(match => isMatchRelevant(match.scheduledAt));

        for (const match of allRelevantMatches) {
          const chatResponse = await request.post(apiURL, {
            data: {
              query: chatRoomListQuery,
              variables: { appName: name },
            },
            headers: {
              'X-language': language,
            },
          });

          const chatData = await chatResponse.json();
          const chatrooms = chatData?.data?.chatQueries?.getChatroomList || [];

          const matchChatroom = chatrooms.find(
            room => room.chatroom.type === 'MATCH' && room.chatroom.entityID === match.id
          );

          expect(matchChatroom).toBeDefined();
        }
      });
    });
  });
}