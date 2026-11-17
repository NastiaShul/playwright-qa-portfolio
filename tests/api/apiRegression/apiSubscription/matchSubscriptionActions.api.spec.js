import { test, expect } from "@playwright/test";
import { matchesUpcomingQuery } from "../apiMatch/matchQueries.js";
import { favorMatchMutation, unfavorMatchMutation } from "./subscriptionMutations.js";
import { currentUserFavMatchesQuery, getFavMatchesByIDsQuery } from "./subscriptionQueries.js";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";

const apiURL = process.env.API_URL;
const token = getAuthToken().user.token;
let language = apiURL?.includes("ua") ? "uk" : apiURL?.includes("by") ? "be" : "en";

test.skip("Subscribe and unsubscribe to match (WEB)", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
    "user-agent": "web",
    "X-Device-Id":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  };

  const matchesResponse = await request.post(apiURL, {
    data: { query: matchesUpcomingQuery },
    headers,
  });
  const matchesData = await matchesResponse.json();
  testInfo.annotations.push({ type: "matches", description: matchesData });
  const matches = matchesData?.data?.stat_matchesUpcoming?.matches || [];
  expect(matches.length).toBeGreaterThan(0);
  const matchID = matches[0].id;

  const subscribeResponse = await request.post(apiURL, {
    data: { query: favorMatchMutation, variables: { matchID } },
    headers,
  });
  const subscribeData = await subscribeResponse.json();
  testInfo.annotations.push({ type: "subscribe", description: subscribeData });
  expect(subscribeData.errors).toBeUndefined();
  expect(subscribeData.data.userSubscriptionsMutations.favorMatch.success).toBe(true);

  await expect.poll(async () => {
    const favResponse = await request.post(apiURL, {
      data: { query: currentUserFavMatchesQuery },
      headers,
    });
    const favData = await favResponse.json();
    testInfo.annotations.push({ type: "subscribedList", description: favData });

    const favMatches = favData?.data?.userSubscriptionsQueries?.currentUserFavMatches?.favMatches || [];
    return favMatches.some((m) => m.matchID === matchID);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

  const unsubscribeResponse = await request.post(apiURL, {
    data: { query: unfavorMatchMutation, variables: { matchID } },
    headers,
  });
  const unsubscribeData = await unsubscribeResponse.json();
  testInfo.annotations.push({ type: "unsubscribe", description: unsubscribeData });
  expect(unsubscribeData.errors).toBeUndefined();
  expect(unsubscribeData.data.userSubscriptionsMutations.unfavorMatch.success).toBe(true);

  await expect.poll(async () => {
    const favResponse = await request.post(apiURL, {
      data: { query: currentUserFavMatchesQuery },
      headers,
    });
    const favData = await favResponse.json();
    testInfo.annotations.push({ type: "unsubscribedList", description: favData });

    const favMatches = favData?.data?.userSubscriptionsQueries?.currentUserFavMatches?.favMatches || [];
    return !favMatches.some((m) => m.matchID === matchID);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});

test.skip("Subscribe and unsubscribe to match (APP)", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
    "user-agent": "android",
    "X-Device-Id": "23b17f44-f01b-4139-955e-7b525ffc1baa",
  };

  const matchesResponse = await request.post(apiURL, {
    data: { query: matchesUpcomingQuery },
    headers,
  });
  const matchesData = await matchesResponse.json();
  testInfo.annotations.push({ type: "matches", description: matchesData });
  const matches = matchesData?.data?.stat_matchesUpcoming?.matches || [];
  expect(matches.length).toBeGreaterThan(0);
  const matchID = matches[0].id;

  const subscribeResponse = await request.post(apiURL, {
    data: { query: favorMatchMutation, variables: { matchID } },
    headers,
  });
  const subscribeData = await subscribeResponse.json();
  testInfo.annotations.push({ type: "subscribe", description: subscribeData });
  expect(subscribeData.errors).toBeUndefined();
  expect(subscribeData.data.userSubscriptionsMutations.favorMatch.success).toBe(true);

  await expect.poll(async () => {
    const favResponse = await request.post(apiURL, {
      data: { query: currentUserFavMatchesQuery },
      headers,
    });
    const favData = await favResponse.json();
    testInfo.annotations.push({ type: "subscribedList", description: favData });
    
    const favMatches = favData?.data?.userSubscriptionsQueries?.currentUserFavMatches?.favMatches || [];
    return favMatches.some((m) => m.matchID === matchID);
  }, { timeout: 5000, intervals: [500, 1000, 2000] }).toBe(true);


  const unsubscribeResponse = await request.post(apiURL, {
    data: { query: unfavorMatchMutation, variables: { matchID } },
    headers,
  });
  const unsubscribeData = await unsubscribeResponse.json();
  testInfo.annotations.push({ type: "unsubscribe", description: unsubscribeData });
  expect(unsubscribeData.errors).toBeUndefined();
  expect(unsubscribeData.data.userSubscriptionsMutations.unfavorMatch.success).toBe(true);

  await expect.poll(async () => {
    const favResponse = await request.post(apiURL, {
      data: { query: currentUserFavMatchesQuery },
      headers,
    });
    const favData = await favResponse.json();
    testInfo.annotations.push({ type: "unsubscribedList", description: favData });

    const favMatches = favData?.data?.userSubscriptionsQueries?.currentUserFavMatches?.favMatches || [];
    return !favMatches.some((m) => m.matchID === matchID);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});

test("Check if getFavMatchesByIDs query works", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
    "user-agent": "web",
    "X-Device-Id":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  };

  const matchesResponse = await request.post(apiURL, {
    data: { query: matchesUpcomingQuery },
    headers,
  });
  const matchesData = await matchesResponse.json();
  testInfo.annotations.push({ type: "matches", description: matchesData });

  const matches = matchesData?.data?.stat_matchesUpcoming?.matches || [];
  expect(matches.length).toBeGreaterThan(1);

  const matchID = matches[1].id;
  console.log(matchID);
  
  const subscribeResponse = await request.post(apiURL, {
    data: { query: favorMatchMutation, variables: { matchID: String(matchID) } },
    headers,
  });
  const subscribeData = await subscribeResponse.json();
  testInfo.annotations.push({ type: "subscribe", description: subscribeData });
  expect(subscribeData.errors).toBeUndefined();
  expect(subscribeData.data.userSubscriptionsMutations.favorMatch.success).toBe(true);

await expect.poll(async () => {
  const favResponse = await request.post(apiURL, {
    data: { query: getFavMatchesByIDsQuery, variables: { matchIDs: [String(matchID)]  } },
    headers,
  });
  const favData = await favResponse.json();
  testInfo.annotations.push({ type: "getFavMatchesByIDs", description: favData });

  const ids = favData?.data?.userSubscriptionsQueries?.getFavMatchesByIDs?.ids || [];
  return ids.includes(matchID);
}, { timeout: 20000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

});

test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== "passed") {
    console.log(`❌ Test failed: ${testInfo.title}`);
    testInfo.annotations.forEach((a) => {
      console.log(`📩 ${a.type}: ${JSON.stringify(a.description, null, 2)}`);
    });
  }
});