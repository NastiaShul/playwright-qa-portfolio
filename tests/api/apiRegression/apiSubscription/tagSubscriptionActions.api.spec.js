import { test, expect } from "@playwright/test";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { getCurrentSubs, subscribeTag, unsubscribeTag } from "../../utils/functions/subscribeFunctions.js";

const apiURL = process.env.API_URL;
const token = getAuthToken().user.token;
const language = apiURL?.includes("ua") ? "uk" : apiURL?.includes("by") ? "be" : "en";
const clubTagId = "1047809"; // dynamo-kyiv
const tournamentTagId = "1365242"; // ucl
const personTagId = "161006712"; // artem-dovbyk

// club
test("Subscribe and unsubscribe to club tag (WEB)", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
    "user-agent": "web",
    "X-Device-Id":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers);
  const alreadySubscribed = favTags.some((t) => t.entityID === clubTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers);
      return !updated.some((t) => t.entityID === clubTagId);
    }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return !updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});

test("Subscribe and unsubscribe to club tag (APP)", async ({ request }, testInfo) => {
  const headers = {
    "X-Language": language,
    "user-agent": "android",
    "X-Device-Id": "23b17f44-f01b-4139-955e-7b525ffc1baa",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers);
  const alreadySubscribed = favTags.some((t) => t.entityID === clubTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers);
      return !updated.some((t) => t.entityID === clubTagId);
    }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, clubTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return !updated.some((t) => t.entityID === clubTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});

// tournament
test("Subscribe and unsubscribe to tournament tag (WEB)", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
    "user-agent": "web",
    "X-Device-Id":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers);
  const alreadySubscribed = favTags.some((t) => t.entityID === tournamentTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, tournamentTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers);
      return !updated.some((t) => t.entityID === tournamentTagId);
    }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, tournamentTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return updated.some((t) => t.entityID === tournamentTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, tournamentTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return !updated.some((t) => t.entityID === tournamentTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});

test("Subscribe and unsubscribe to tournament tag (APP)", async ({ request }, testInfo) => {
  const headers = {
    "X-Language": language,
    "user-agent": "android",
    "X-Device-Id": "23b17f44-f01b-4139-955e-7b525ffc1baa",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers);
  const alreadySubscribed = favTags.some((t) => t.entityID === tournamentTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, tournamentTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers);
      return !updated.some((t) => t.entityID === tournamentTagId);
    }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, tournamentTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return updated.some((t) => t.entityID === tournamentTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, tournamentTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return !updated.some((t) => t.entityID === tournamentTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});

// person
test("Subscribe and unsubscribe to person tag (WEB)", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
    "user-agent": "web",
    "X-Device-Id":
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) " +
      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers);
  const alreadySubscribed = favTags.some((t) => t.entityID === personTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, personTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers);
      return !updated.some((t) => t.entityID === personTagId);
    }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, personTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return updated.some((t) => t.entityID === personTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, personTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return !updated.some((t) => t.entityID === personTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});

test("Subscribe and unsubscribe to person tag (APP)", async ({ request }, testInfo) => {
  const headers = {
    "X-Language": language,
    "user-agent": "android",
    "X-Device-Id": "23b17f44-f01b-4139-955e-7b525ffc1baa",
  };

  let favTags = await getCurrentSubs(request, apiURL, headers);
  const alreadySubscribed = favTags.some((t) => t.entityID === personTagId);

  if (alreadySubscribed) {
    const data = await unsubscribeTag(request, apiURL, headers, personTagId, testInfo);
    expect(data.errors).toBeUndefined();
    expect(data.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

    await expect.poll(async () => {
      const updated = await getCurrentSubs(request, apiURL, headers);
      return !updated.some((t) => t.entityID === personTagId);
    }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
  }

  const subData = await subscribeTag(request, apiURL, headers, personTagId, testInfo);
  expect(subData.errors).toBeUndefined();
  expect(subData.data.userSubscriptionsMutations.subscribeToTag.subscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return updated.some((t) => t.entityID === personTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);

  const unsubData = await unsubscribeTag(request, apiURL, headers, personTagId, testInfo);
  expect(unsubData.errors).toBeUndefined();
  expect(unsubData.data.userSubscriptionsMutations.unsubscribeTag.unsubscribed).toBe(true);

  await expect.poll(async () => {
    const updated = await getCurrentSubs(request, apiURL, headers);
    return !updated.some((t) => t.entityID === personTagId);
  }, { timeout: 10000, intervals: [500, 1000, 2000, 5000] }).toBe(true);
});


test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== "passed") {
    console.log(`❌ Test failed: ${testInfo.title}`);
    testInfo.annotations.forEach((a) => {
      console.log(`📩 ${a.type}: ${JSON.stringify(a.description, null, 2)}`);
    });
  }
});