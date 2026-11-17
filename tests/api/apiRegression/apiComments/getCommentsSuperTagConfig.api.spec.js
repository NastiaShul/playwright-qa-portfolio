import { test, expect } from "@playwright/test";
import { getCommentsSuperTagsConfigQuery } from "./commentQueries";

const apiURL = process.env.API_URL;

  test("Check if getCommentsSuperTagsConfigQuery query works", async ({ request }, testInfo) => {
    const postResponse = await request.post(apiURL, {
        data: { query: getCommentsSuperTagsConfigQuery },
    });
        
    const postResponseBody = await postResponse.json();
    testInfo.annotations.push({ type: 'response', description: postResponseBody });

    const superTagConfigItems = postResponseBody.data.adminQueries.configQueries.superTags;
    expect(superTagConfigItems).toBeDefined();
    expect(superTagConfigItems).toBeInstanceOf(Array);

    if(superTagConfigItems.length > 0) {
        for (const item of superTagConfigItems) {
          expect(item).toHaveProperty("colorDark");
          expect(typeof item.colorDark).toBe("string");

          expect(item).toHaveProperty("colorLight");
          expect(typeof item.colorLight).toBe("string");

          expect(item).toHaveProperty("mobileAppConfig");
          expect(typeof item.mobileAppConfig).toBe("object");
          const config = item.mobileAppConfig;
          expect(config).toHaveProperty("appURL");
          expect(typeof config.appURL).toBe("string");
          expect(config).toHaveProperty("logoURL");
          expect(typeof config.logoURL).toBe("string");
          expect(config).toHaveProperty("id");
          expect(typeof config.id).toBe("string");
          expect(config).toHaveProperty("name");
          expect(typeof config.name).toBe("string");
      
          expect(config).toHaveProperty("tag");
          expect(typeof config.tag).toBe("object");
          const tag = config.tag;
          expect(tag).toHaveProperty("id");
          expect(typeof tag.id).toBe("string");
          expect(tag).toHaveProperty("title");
          expect(typeof tag.title).toBe("object");
          expect(tag.title).toHaveProperty("defaultValue");
          expect(typeof tag.title.defaultValue).toBe("string");
          expect(tag).toHaveProperty("logo");
          expect(typeof tag.logo).toBe("object");
          expect(tag.logo).toHaveProperty("url");
          expect(typeof tag.logo.url).toBe("string");
        }
    }
  });

  test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});