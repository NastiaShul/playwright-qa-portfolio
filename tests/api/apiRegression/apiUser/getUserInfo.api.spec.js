import { test, expect } from "@playwright/test";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { getUserInfoQuery, getUserInfoQueryInt } from "./userQueries.js";

const apiURL = process.env.API_URL;

test("Check if getUserInfo query works", async ({ request }, testInfo) => {
  const tokenData = getAuthToken();
  const userId = tokenData.user.userId

  const response = await request.post(apiURL, {
    data: {
      query: apiURL?.includes('ua') || apiURL?.includes('by') ? getUserInfoQuery : getUserInfoQueryInt,
      variables: { userId },
    }
  });

  const responseBody = await response.json();

  testInfo.annotations.push({ type: 'response', description: responseBody });

  expect(responseBody.errors).toBeUndefined();
  expect(responseBody.data?.userQueries?.get).toBeDefined();

  const user = responseBody.data.userQueries.get;
  expect(user.id).toBeDefined();
  expect(user.name).toBeDefined();
  expect(typeof user.name).toBe('string');

  expect(user.createTime).toBeDefined();
  expect(typeof user.createTime).toBe('string');

  expect(user.avatar).toBeDefined();
  expect(typeof user.avatar === 'object' || user.avatar === null).toBe(true);
  if (user.avatar !== null) {
    expect(user.avatar).toHaveProperty('url');
    expect(typeof user.avatar.url).toBe('string')
  }

  expect(user.bio).toBeDefined();
  expect(typeof user.bio === 'string' || user.bio === null).toBe(true);

  expect(user.location).toBeDefined();
  expect(typeof user.location === 'object' || user.location === null).toBe(true);
  if (user.location !== null) {
    expect(typeof user.location).toBe('object');
    expect(user.location).toHaveProperty('city');
    expect(typeof user.location.city === 'string' || user.location.city === null).toBe(true);

    expect(user.location).toHaveProperty('country');
    expect(typeof user.location.country === 'object' || user.location.country === null).toBe(true);
    if (user.location.country !== null) {
      const country = user.location.country;
      expect(typeof country.name).toBe('string');
      expect(typeof country.code).toBe('string');
      expect(country.picture).toBeDefined();
      expect(typeof country.picture.main).toBe('string');
    }
  }

  if (apiURL?.includes('ua') || apiURL?.includes('by')) {
    expect(user.rating).toBeDefined();
    expect(typeof user.rating).toBe('object');
    expect(user.rating).toHaveProperty('position');
    expect(typeof user.rating.position).toBe('string');
    expect(user.rating).toHaveProperty('rating');
    expect(typeof user.rating.rating).toBe('string');
  }

  expect(user.roles).toBeDefined();
  expect(Array.isArray(user.roles)).toBe(true);
  user.roles.forEach(roleObj => {
    expect(roleObj).toHaveProperty('ID');
    expect(typeof roleObj.ID).toBe('string');
  });
});

test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
    console.log(`❌ Test failed: ${testInfo.title}`);
    console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
  }
});