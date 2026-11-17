import { test, expect } from "@playwright/test";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";

import {
  getCurrentSubs,
  subscribeTag,
  unsubscribeTag,
  getClubMatches,
  getFavMatchesByIDs
} from "../../utils/functions/subscribeFunctions.js";

const apiURL = process.env.API_URL;
const token = getAuthToken().admin.token;

const language = apiURL?.includes("ua")
  ? "uk"
  : apiURL?.includes("by")
    ? "be"
    : "en";

const clubTagId = "161065675"; // polissya zhytomyr tag
const statTeamId = "polissya_zhytomyr"; // stat team id

test.skip("Subscribe club tag and verify auto-subscription to all club matches (WEB)", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
    "user-agent": "web",
    "X-Device-Id":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers, testInfo);
  const alreadySubscribed = favTags.some((t) => t.entityID === clubTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers, testInfo);
      return !updated.some((t) => t.entityID === clubTagId);
    }, { timeout: 40000, interval: 10000 }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers, testInfo);
    return updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 40000, interval: 10000 }).toBe(true);

  let matchIDs = [];
  await expect.poll(async () => {
    const matches = await getClubMatches(request, apiURL, headers, statTeamId);
    if (matches && matches.length > 0) {
      matchIDs = matches.map((m) => m.id);
      return true;
    }
  }, { timeout: 40000, interval: 10000 }).toBe(true);

  await expect.poll(async () => {
    const favMatchIDs = await getFavMatchesByIDs(request, apiURL, headers, matchIDs);
    if (!favMatchIDs || favMatchIDs.length === 0) return false;

    const allMatchesSubscribed = matchIDs.every((id) => favMatchIDs.includes(id));
    return allMatchesSubscribed;
  }, {
    timeout: 60000,
    intervals: [5000, 10000]
  }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers, testInfo);
    return !updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 40000, interval: 10000 }).toBe(true);

  await expect.poll(async () => {
    const favMatchIDsAfterUnsub = await getFavMatchesByIDs(request, apiURL, headers, matchIDs);
    return favMatchIDsAfterUnsub.length === 0;
  }, { timeout: 90000, intervals: [10000, 20000, 30000] }).toBe(true);

});

test.skip("Subscribe club tag and verify auto-subscription to all club matches (APP)", async ({ request }, testInfo) => {
  const headers = {
    "X-Language": language,
    "user-agent": "android",
    "X-Device-Id": "23b17f44-f01b-4139-955e-7b525ffc1baa",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers, testInfo);
  const alreadySubscribed = favTags.some((t) => t.entityID === clubTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers, testInfo);
      return !updated.some((t) => t.entityID === clubTagId);
    }, { timeout: 40000, interval: 10000 }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers, testInfo);
    return updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 40000, interval: 10000 }).toBe(true);

  let matchIDs = [];
  await expect.poll(async () => {
    const matches = await getClubMatches(request, apiURL, headers, statTeamId);
    if (matches && matches.length > 0) {
      matchIDs = matches.map((m) => m.id);
      return true;
    }
  }, { timeout: 40000, interval: 10000 }).toBe(true);

  await expect.poll(async () => {
    const favMatchIDs = await getFavMatchesByIDs(request, apiURL, headers, matchIDs);
    if (!favMatchIDs || favMatchIDs.length === 0) return false;

    const allMatchesSubscribed = matchIDs.every((id) => favMatchIDs.includes(id));
    return allMatchesSubscribed;
  }, {
    timeout: 60000,
    intervals: [5000, 10000]
  }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers, testInfo);
    return !updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 40000, interval: 10000 }).toBe(true);

  await expect.poll(async () => {
    const favMatchIDsAfterUnsub = await getFavMatchesByIDs(request, apiURL, headers, matchIDs);
    return favMatchIDsAfterUnsub.length === 0;
  }, { timeout: 90000, intervals: [10000, 20000, 30000] }).toBe(true);

});