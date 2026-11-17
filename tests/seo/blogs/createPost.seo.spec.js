import { test, expect } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { authState } from "../../../src/utils/uiAuthHelper";
import { checkProject } from "../../api/utils/functions/checkProject";
import {
    createPostSeoData,
    createPostUser,
    buildCreatePostUrlPattern
} from "./data/createPost.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const { locales } = createPostSeoData[project];

for (const locale of locales) {
    const url = `${BASE_URL}${locale.path}`;
    const urlPattern = buildCreatePostUrlPattern(BASE_URL, locale.path);

    test.describe(`SEO: Create post page [${project} / ${locale.lang}]`, () => {

        test.describe("Authorized user", () => {
            let context;
            let seoPage;

            // The page is opened once for all checks; each check is a separate test
            test.beforeAll(async ({ browser }) => {
                context = await browser.newContext({ userAgent: "UIAutotest" });
                await authState(context, createPostUser);
                const page = await context.newPage();
                seoPage = new SeoPage(page);
                await seoPage.open(url);
                // The app substitutes the blog id after client-side auth — wait for it
                await expect(page).toHaveURL(urlPattern, { timeout: 20000 });
            });

            test.afterAll(async () => {
                await context?.close();
            });

            test("URL should match template with blog id", async () => {
                await expect(seoPage.page).toHaveURL(urlPattern);
            });

            test("Page should be noindex", async () => {
                await seoPage.checkPageIsNoindex();
            });

            test("Page should not have hreflang", async () => {
                await seoPage.checkHreflangsAreAbsent();
            });
        });

        // test.describe("Guest", () => {
        //     let seoPage;

        //     test.beforeAll(async ({ browser }) => {
        //         const page = await browser.newPage({ userAgent: "UIAutotest" });
        //         seoPage = new SeoPage(page);
        //         await seoPage.open(url);
        //     });

        //     test.afterAll(async () => {
        //         await seoPage?.page.close();
        //     });

        //     test("Page should return 403", async () => {
        //         await seoPage.checkStatusCode(403);
        //     });
        // });
    });
}
