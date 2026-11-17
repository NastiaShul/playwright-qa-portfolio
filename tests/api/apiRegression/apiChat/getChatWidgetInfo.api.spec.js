import { test, expect } from "@playwright/test";
import { matchesUpcomingQuery} from "../apiMatch/matchQueries";
import { getChatWidgetInfoQuery, GetMatchDetailedChatWidgetQuery} from "./chatQueries";
import { checkProject, languageForProject } from "../../utils/functions/checkProject";

const apiURL = process.env.API_URL;
const project = await checkProject(apiURL);
const languages = await languageForProject(project);
  
test("Check if Chat Widget Info query works", async ({ request }, testInfo) => {
    const teaserResponse = await request.post(apiURL, {
      data: {
        query: matchesUpcomingQuery
      }
    });

    const teaserResponseBody = await teaserResponse.json();
    
    testInfo.annotations.push({ type: 'response', description: teaserResponseBody }); 

    const matchId = await teaserResponseBody.data?.stat_matchesUpcoming?.matches[0].id;
    
    for(let language of languages) {
      const chatWidgetInfoResponse = await request.post(apiURL, {
        data: {
          query: getChatWidgetInfoQuery,
          variables: { entityID: matchId },
        },
          headers: {
              'X-language': language
          }
      });
  
      const chatWidgetInfoResponseBody = await chatWidgetInfoResponse.json();
      testInfo.annotations.push({ type: 'response', description: chatWidgetInfoResponseBody });
  
      expect(chatWidgetInfoResponseBody.errors).toBeUndefined();
      const chatWidgetInfo = chatWidgetInfoResponseBody.data.chatQueries.getChatroomByEntityID;
      expect(chatWidgetInfo).toBeDefined();
  
      expect(chatWidgetInfo.totalMessagesCount).toBeDefined();
      expect(typeof chatWidgetInfo.totalMessagesCount).toBe('number');
  
      const chattyUsers = chatWidgetInfo.chattyUsers;
      expect(chattyUsers).toBeDefined()
      expect(Array.isArray(chattyUsers)).toBe(true);
      if(chattyUsers.length > 0) {
          expect(chattyUsers[0]).toHaveProperty('user');
          expect(chattyUsers[0].user.name).toBeDefined();
          expect(typeof chattyUsers[0].user.name).toBe('string');
          expect(chattyUsers[0].user.avatar).toBeDefined();
          expect(typeof chattyUsers[0].user.avatar === 'object' || chattyUsers[0].user.avatar === null).toBe(true);
          if(chattyUsers[0].user.avatar !== null) {
              expect(chattyUsers[0].user.avatar.webp).toBeDefined();
              expect(typeof chattyUsers[0].user.avatar.webp).toBe('string');
          }
      }
    }
});

test("Check if GetMatchDetailedChatWidgetQuery query works", async ({ request }, testInfo) => {
    const teaserResponse = await request.post(apiURL, {
      data: {
        query: matchesUpcomingQuery
      }
    });

    const teaserResponseBody = await teaserResponse.json();
    
    testInfo.annotations.push({ type: 'response', description: teaserResponseBody }); 

    const matchId = await teaserResponseBody.data?.stat_matchesUpcoming?.matches[0].id;
    
    for(let language of languages) {
      const chatWidgetInfoResponse = await request.post(apiURL, {
        data: {
          query: GetMatchDetailedChatWidgetQuery,
          variables: { entityID: matchId },
        },
          headers: {
              'X-language': language
          }
      });
  
      const chatWidgetInfoResponseBody = await chatWidgetInfoResponse.json();
      testInfo.annotations.push({ type: 'response', description: chatWidgetInfoResponseBody });
  
      expect(chatWidgetInfoResponseBody.errors).toBeUndefined();
      const chatWidgetInfo = chatWidgetInfoResponseBody.data.chatQueries.getChatroomByEntityID;
      expect(chatWidgetInfo).toBeDefined();
    }
});

test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});