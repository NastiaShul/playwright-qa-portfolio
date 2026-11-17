import { test, expect } from "@playwright/test";
import { appsClubCyrillic } from "../../../../src/constants";
import { getCommentsCountQuery } from "./commentQueries";

const apiURL = process.env.API_URL;

if (apiURL?.includes("ua")) {
  test.describe("Check commentsCount consistency across apps + web (UA project)", () => {
    const contexts = [
      ...appsClubCyrillic,
      { name: "web", id: "web", language: "uk" },
      { name: "web", id: "web", language: "ru" },
    ];

    test("commentsCount should be consistent everywhere", async ({ request }, testInfo) => {
      const results = [];

      for (const ctx of contexts) {
        const headers = { "X-Language": ctx.language, };

        if (ctx.name !== "web") {
          headers["X-sportsapp-app"] = ctx.name;
          headers["User-Agent"] = "IOS";
        }

        const response = await request.post(apiURL, {
          data: {
            query: getCommentsCountQuery,
            variables: { id: "3146304" },
          },
          headers,
        });

        expect(response.ok(), `HTTP error ${response.status()} for ${ctx.name}-${ctx.language}`).toBeTruthy();

        const body = await response.json();

        testInfo.annotations.push({
          type: "response",
          description: { context: `${ctx.name}-${ctx.language}`, body },
        });

        expect(
          body.errors,
          `GraphQL errors for ${ctx.name}-${ctx.language}: ${JSON.stringify(body.errors)}`
        ).toBeUndefined();

        const count = body?.data?.postQueries?.get?.commentsCount;
        expect(count, `Missing commentsCount for ${ctx.name}-${ctx.language}`).toBeDefined();
        expect(count, `commentsCount is null for ${ctx.name}-${ctx.language}`).not.toBeNull();

        results.push({ context: `${ctx.name}-${ctx.language}`, count });
      }

      console.table(results);

      const counts = results.map(r => r.count);
      const uniqueCounts = [...new Set(counts)];

      expect(uniqueCounts.length).toBe(1);
    });

    test.afterEach(async ({ }, testInfo) => {
      if (testInfo.status !== "passed") {
        const responses = testInfo.annotations.filter(a => a.type === "response");
        if (responses.length > 0) {
          console.log(`❌ Test failed: ${testInfo.title}`);
          for (const r of responses) {
            console.log(`📩 Response [${r.description.context}]:`);
            console.dir(r.description.body, { depth: null });
          }
        }
      }
    });
  });
}

