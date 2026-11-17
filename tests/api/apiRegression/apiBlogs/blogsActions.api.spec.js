import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { createBlogMutation, deleteBlogMutation, updateBlogMutation } from "./blogMutations.js";
import { getUsersBlogs } from "./blogQueries.js";

const apiURL = process.env.API_URL;
const { token, userId } = getAuthToken().user;
const language = apiURL?.includes("ua") ? "uk" : apiURL?.includes("by") ? "be" : "en";

let blogIdsToDelete = [];

test("Create and verify user's blog", async ({ request }, testInfo) => {
  const title = `Test blog ${faker.random.alpha(5)}`;
  const description = `This is a test blog - ${faker.lorem.sentence()}`;

  const variables = {
    title: title,
    description: description,
  };

  const createResponse = await request.post(apiURL, {
    data: {
      query: createBlogMutation,
      variables,
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  expect(createResponse.ok()).toBeTruthy();
  const createBody = await createResponse.json();
  testInfo.annotations.push({ type: 'response', description: createBody });

  const createdBlog = createBody?.data?.blogMutations?.createBlog;

  expect(createdBlog).toBeDefined();
  expect(createdBlog.title).toBe(title);
  expect(createdBlog.description).toBe(description);

  const createdBlogId = createdBlog.id;
  blogIdsToDelete.push(createdBlogId);

  const getResponse = await request.post(apiURL, {
    data: {
      query: getUsersBlogs,
      variables: { userID: userId },
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  expect(getResponse.ok()).toBeTruthy();
  const getResponseBody = await getResponse.json();
  testInfo.annotations.push({ type: 'response', description: getResponseBody });

  const blogs = getResponseBody?.data?.blogsQueries?.ByUser?.items || [];

  const foundBlog = blogs.find((b) => b.id === createdBlog.id);

  expect(foundBlog).toBeDefined();
  expect(foundBlog.title).toBe(title);
  expect(foundBlog.description).toBe(description);
});

test("Create a blog and update title, verify", async ({ request }, testInfo) => {
  const originalTitle = `Blog ${faker.random.alpha(5)}`;
  const description = faker.lorem.sentence();

  const createResponse = await request.post(apiURL, {
    data: {
      query: createBlogMutation,
      variables: { title: originalTitle, description },
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  const createdBlog = (await createResponse.json()).data.blogMutations.createBlog;
  testInfo.annotations.push({ type: 'response', description: await createResponse.json() });
  expect(createdBlog).toBeDefined();

  const blogId = createdBlog.id;
  blogIdsToDelete.push(blogId);

  const originalHru = createdBlog.hru;

  const updatedTitle = `Updated title ${faker.random.alpha(6)}`;
  const updateResponse = await request.post(apiURL, {
    data: {
      query: updateBlogMutation,
      variables: {
        id: blogId,
        title: updatedTitle,
      },
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  const updatedBlog = (await updateResponse.json()).data.blogMutations.updateBlog;
  testInfo.annotations.push({ type: 'response', description: await updateResponse.json() });

  expect(updatedBlog.title).toBe(updatedTitle);
  expect(updatedBlog.hru).toBe(originalHru);
});

test("Create a blog and update description, verify", async ({ request }, testInfo) => {
  const title = `Blog ${faker.random.alpha(5)}`;
  const OriginalDescription = faker.lorem.sentence();

  const createResponse = await request.post(apiURL, {
    data: {
      query: createBlogMutation,
      variables: { title, description: OriginalDescription },
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  const createdBlog = (await createResponse.json()).data.blogMutations.createBlog;
  testInfo.annotations.push({ type: 'response', description: await createResponse.json() });
  expect(createdBlog).toBeDefined();

  const blogId = createdBlog.id;
  blogIdsToDelete.push(blogId);

  const originalHru = createdBlog.hru;

  const updatedDescription = `Updated description ${faker.random.alpha(6)}`;
  const updateResponse = await request.post(apiURL, {
    data: {
      query: updateBlogMutation,
      variables: {
        id: blogId,
        description: updatedDescription,
      },
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  const updatedBlog = (await updateResponse.json()).data.blogMutations.updateBlog;
  testInfo.annotations.push({ type: 'response', description: await updateResponse.json() });

  expect(updatedBlog.description).toBe(updatedDescription);
  expect(updatedBlog.hru).toBe(originalHru);
});

test("Create a blog, update title&description, verify", async ({ request }, testInfo) => {
  const OriginalTitle = `Blog ${faker.random.alpha(5)}`;
  const OriginalDescription = faker.lorem.sentence();

  const createResponse = await request.post(apiURL, {
    data: {
      query: createBlogMutation,
      variables: { title: OriginalTitle, description: OriginalDescription },
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  const createdBlog = (await createResponse.json()).data.blogMutations.createBlog;
  testInfo.annotations.push({ type: 'response', description: await createResponse.json() });

  expect(createdBlog).toBeDefined();

  const blogId = createdBlog.id;
  blogIdsToDelete.push(blogId);

  const originalHru = createdBlog.hru;

  const updatedTitle = `Updated title ${faker.random.alpha(6)}`;
  const updatedDescription = `Updated description ${faker.random.alpha(6)}`;
  const updateResponse = await request.post(apiURL, {
    data: {
      query: updateBlogMutation,
      variables: {
        id: blogId,
        description: updatedDescription,
        title: updatedTitle,
      },
    },
    headers: {
      "X-language": language,
      "X-Auth-Token": token,
    },
  });

  const updatedBlog = (await updateResponse.json()).data.blogMutations.updateBlog;
  testInfo.annotations.push({ type: 'response', description: await updateResponse.json() });

  expect(updatedBlog.title).toBe(updatedTitle);
  expect(updatedBlog.description).toBe(updatedDescription);
  expect(updatedBlog.hru).toBe(originalHru);
});

test("Blog creation with stop words 'add' or 'edit' should fail and not create blog", async ({ request }, testInfo) => {
  const stopWords = ["add", "edit"];

  for (const word of stopWords) {
    const variables = {
      title: word,
      description: faker.lorem.sentence(),
    };

    const response = await request.post(apiURL, {
      data: {
        query: createBlogMutation,
        variables,
      },
      headers: {
        "X-language": language,
        "X-Auth-Token": token,
      },
    });

    const responseBody = await response.json();
    testInfo.annotations.push({ type: 'response', description: responseBody });
    expect(responseBody.errors?.[0]?.message).toContain(
      "blog with current name already exist"
    );

    expect(responseBody.data?.blogMutations).toBeNull();

    const getResponse = await request.post(apiURL, {
      data: {
        query: getUsersBlogs,
        variables: { userID: userId },
      },
      headers: {
        "X-language": language,
        "X-Auth-Token": token,
      },
    });

    const getResponseBody = await getResponse.json();
    testInfo.annotations.push({ type: 'response', description: getResponseBody });
    const blogs = getResponseBody?.data?.blogsQueries?.ByUser?.items || [];
    const found = blogs.find((b) => b.title === word);

    expect(found).toBeUndefined();
  }
});

test.afterEach(async ({ request }, testInfo) => {
  if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
    console.log(`❌ Test failed: ${testInfo.title}`);
    console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
  }

  for (const blogId of blogIdsToDelete) {
    await request.post(apiURL, {
      data: {
        query: deleteBlogMutation,
        variables: { blogId },
      },
      headers: {
        "X-language": language,
        "X-Auth-Token": token,
      },
    });
  }
  blogIdsToDelete.length = 0;
});