import { test, expect } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { BlogPage } from "../../../pages/blog.page";
import { authState } from "../../../src/utils/uiAuthHelper";
import { checkProject } from "../../api/utils/functions/checkProject";
import { createBlogSeoData, createBlogUser } from "./data/createBlog.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const { locales } = createBlogSeoData[project];

for (const locale of locales) {
    const url = `${BASE_URL}${locale.path}`;

    test.describe(`SEO: Create blog page [${project} / ${locale.lang}]`, () => {

        test.describe("Authorized user", () => {
            let context;
            let seoPage;
            let blogPage;

            // The page is opened once for all checks; each check is a separate test
            test.beforeAll(async ({ browser }) => {
                context = await browser.newContext({ userAgent: "UIAutotest" });
                await authState(context, createBlogUser);
                const page = await context.newPage();
                seoPage = new SeoPage(page);
                blogPage = new BlogPage(page);
                await seoPage.open(url);
                // SSR returns 403, auth is picked up on the client — wait for the create blog form
                await expect(blogPage.blogCreateWrapper).toBeVisible({ timeout: 20000 });
            });

            test.afterAll(async () => {
                await context?.close();
            });

            test("Create blog form should be displayed", async () => {
                await expect(blogPage.blogCreateWrapper).toBeVisible();
                await expect(seoPage.page).toHaveURL(url);
            });

            test("Page should be noindex", async () => {
                await seoPage.checkPageIsNoindex();
            });

            test("Page should not have hreflang", async () => {
                await seoPage.checkHreflangsAreAbsent();
            });
        });

        test.describe("Guest", () => {
            let seoPage;

            test.beforeAll(async ({ browser }) => {
                const page = await browser.newPage({ userAgent: "UIAutotest" });
                seoPage = new SeoPage(page);
                await seoPage.open(url);
            });

            test.afterAll(async () => {
                await seoPage?.page.close();
            });

            test("Page should return 403", async () => {
                await seoPage.checkStatusCode(403);
            });
        });
    });
}
