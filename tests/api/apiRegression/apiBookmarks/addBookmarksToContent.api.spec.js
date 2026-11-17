import { test, expect } from "@playwright/test";
import { addBookmark, removeBookmark } from "./bookmarksMutation.js";
import { getCurrentUserBookmarksOnNews, getCurrentUserBookmarksOnPost, getCurrentUserBookmarksOnPoll } from "./bookmarksQuery.js";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";

const apiURL = process.env.API_URL;
const token = getAuthToken().user.token;
let language = apiURL?.includes("ua") ? "uk" : apiURL?.includes("by") ? "be" : "de";

test("Add and remove bookmark on news", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
  };

  const newsID = apiURL?.includes("ua")
    ? "1000000283226"
    : apiURL?.includes("by")
      ? "1113050667"
      : "c63bee6c-8441-4c4d-9f66-a354ad9b5d0c";

  const addBookmarkResponse = await request.post(apiURL, {
    data: {
      query: addBookmark,
      variables: { objectClass: "NEWS", objectID: newsID },
    },
    headers,
  });

  const addBookmarkData = await addBookmarkResponse.json();
  testInfo.annotations.push({ type: "addResponse", description: addBookmarkData });

  expect(addBookmarkData.errors).toBeUndefined();
  expect(addBookmarkData.data.bookmarkMutations.addBookmark.success).toBe(true);

  await expect.poll(async () => {
    const currentUserBookmarksResponse = await request.post(apiURL, {
      data: { query: getCurrentUserBookmarksOnNews },
      headers,
    });
    const currentUserBookmarksData = await currentUserBookmarksResponse.json();
    testInfo.annotations.push({ type: "bookmarksAfterAdd", description: currentUserBookmarksData });

    const currentUserBookmarks =
      currentUserBookmarksData?.data?.bookmarkQueries?.currentUserBookmarks?.bookmarks || [];

    return currentUserBookmarks.some((b) => String(b.id) === String(newsID));
  }, { timeout: 5000, intervals: [500, 1000, 2000] }).toBe(true);

  const removeBookmarkResponse = await request.post(apiURL, {
    data: {
      query: removeBookmark,
      variables: { objectClass: "NEWS", objectID: newsID },
    },
    headers,
  });

  const removeBookmarkData = await removeBookmarkResponse.json();
  testInfo.annotations.push({ type: "removeResponse", description: removeBookmarkData });

  expect(removeBookmarkData.errors).toBeUndefined();
  expect(removeBookmarkData.data.bookmarkMutations.removeBookmark.success).toBe(true);

  await expect.poll(async () => {
    const currentUserBookmarksResponse = await request.post(apiURL, {
      data: { query: getCurrentUserBookmarksOnNews },
      headers,
    });
    const currentUserBookmarksData = await currentUserBookmarksResponse.json();
    testInfo.annotations.push({ type: "bookmarksAfterRemove", description: currentUserBookmarksData });

    const currentUserBookmarks =
      currentUserBookmarksData?.data?.bookmarkQueries?.currentUserBookmarks?.bookmarks || [];

    return !currentUserBookmarks.some((b) => String(b.id) === String(newsID));
  }, { timeout: 5000, intervals: [500, 1000, 2000] }).toBe(true);
});

test("Add and remove bookmark on post", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
  };

  const postID = apiURL?.includes("ua")
    ? "3147988"
    : apiURL?.includes("by")
      ? "3282075"
      : "112421";

  const addBookmarkResponse = await request.post(apiURL, {
    data: {
      query: addBookmark,
      variables: { objectClass: "POST", objectID: postID },
    },
    headers,
  });

  const addBookmarkData = await addBookmarkResponse.json();
  testInfo.annotations.push({ type: "addResponse", description: addBookmarkData });

  expect(addBookmarkData.errors).toBeUndefined();
  expect(addBookmarkData.data.bookmarkMutations.addBookmark.success).toBe(true);

  await expect.poll(async () => {
    const currentUserBookmarksResponse = await request.post(apiURL, {
      data: { query: getCurrentUserBookmarksOnPost },
      headers,
    });
    const currentUserBookmarksData = await currentUserBookmarksResponse.json();
    testInfo.annotations.push({ type: "bookmarksAfterAdd", description: currentUserBookmarksData });

    const currentUserBookmarks =
      currentUserBookmarksData?.data?.bookmarkQueries?.currentUserBookmarks?.bookmarks || [];

    return currentUserBookmarks.some((b) => String(b.id) === String(postID));
  }, { timeout: 5000, intervals: [500, 1000, 2000] }).toBe(true);

  const removeBookmarkResponse = await request.post(apiURL, {
    data: {
      query: removeBookmark,
      variables: { objectClass: "POST", objectID: postID },
    },
    headers,
  });

  const removeBookmarkData = await removeBookmarkResponse.json();
  testInfo.annotations.push({ type: "removeResponse", description: removeBookmarkData });

  expect(removeBookmarkData.errors).toBeUndefined();
  expect(removeBookmarkData.data.bookmarkMutations.removeBookmark.success).toBe(true);

  await expect.poll(async () => {
    const currentUserBookmarksResponse = await request.post(apiURL, {
      data: { query: getCurrentUserBookmarksOnPost },
      headers,
    });
    const currentUserBookmarksData = await currentUserBookmarksResponse.json();
    testInfo.annotations.push({ type: "bookmarksAfterRemove", description: currentUserBookmarksData });

    const currentUserBookmarks =
      currentUserBookmarksData?.data?.bookmarkQueries?.currentUserBookmarks?.bookmarks || [];

    return !currentUserBookmarks.some((b) => String(b.id) === String(postID));
  }, { timeout: 5000, intervals: [500, 1000, 2000] }).toBe(true);
});

test("Add and remove bookmark on poll", async ({ request }, testInfo) => {
  const headers = {
    "X-Auth-Token": token,
    "X-Language": language,
  };

  const pollID = apiURL?.includes("ua")
    ? "2000000000186"
    : apiURL?.includes("by")
      ? "2000000000008"
      : "2000000000801";

  const addBookmarkResponse = await request.post(apiURL, {
    data: {
      query: addBookmark,
      variables: { objectClass: "POLL", objectID: pollID },
    },
    headers,
  });

  const addBookmarkData = await addBookmarkResponse.json();
  testInfo.annotations.push({ type: "addResponse", description: addBookmarkData });

  expect(addBookmarkData.errors).toBeUndefined();
  expect(addBookmarkData.data.bookmarkMutations.addBookmark.success).toBe(true);

  await expect.poll(async () => {
    const currentUserBookmarksResponse = await request.post(apiURL, {
      data: { query: getCurrentUserBookmarksOnPoll },
      headers,
    });
    const currentUserBookmarksData = await currentUserBookmarksResponse.json();
    testInfo.annotations.push({ type: "bookmarksAfterAdd", description: currentUserBookmarksData });

    const currentUserBookmarks =
      currentUserBookmarksData?.data?.bookmarkQueries?.currentUserBookmarks?.bookmarks || [];

    return currentUserBookmarks.some((b) => String(b.id) === String(pollID));
  }, { timeout: 5000, intervals: [500, 1000, 2000] }).toBe(true);

  const removeBookmarkResponse = await request.post(apiURL, {
    data: {
      query: removeBookmark,
      variables: { objectClass: "POLL", objectID: pollID },
    },
    headers,
  });

  const removeBookmarkData = await removeBookmarkResponse.json();
  testInfo.annotations.push({ type: "removeResponse", description: removeBookmarkData });

  expect(removeBookmarkData.errors).toBeUndefined();
  expect(removeBookmarkData.data.bookmarkMutations.removeBookmark.success).toBe(true);

  await expect.poll(async () => {
    const currentUserBookmarksResponse = await request.post(apiURL, {
      data: { query: getCurrentUserBookmarksOnPoll },
      headers,
    });
    const currentUserBookmarksData = await currentUserBookmarksResponse.json();
    testInfo.annotations.push({ type: "bookmarksAfterRemove", description: currentUserBookmarksData });

    const currentUserBookmarks =
      currentUserBookmarksData?.data?.bookmarkQueries?.currentUserBookmarks?.bookmarks || [];

    return !currentUserBookmarks.some((b) => String(b.id) === String(pollID));
  }, { timeout: 5000, intervals: [500, 1000, 2000] }).toBe(true);
});



test.afterEach(async ({ }, testInfo) => {
  if (testInfo.status !== "passed") {
    console.log(`❌ Test failed: ${testInfo.title}`);
    testInfo.annotations.forEach((a) => {
      console.log(`📩 ${a.type}: ${JSON.stringify(a.description, null, 2)}`);
    });
  }
});
