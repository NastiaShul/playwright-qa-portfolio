import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { blogPages } from "./data/blogPage.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const blogPage of blogPages[project] ?? []) {
    test.describe(`SEO: Blog page [${project} / ${blogPage.name}]`, () => {
        const url = `${BASE_URL}${blogPage.path}`;
        let seoPage;

        // The page is opened once for all checks; each check is a separate test
        test.beforeAll(async () => {
            seoPage = SeoPage.request();
            await seoPage.open(url);
        });

        test.afterAll(async () => {
            await seoPage?.close();
        });

        test("URL should match template", async () => {
            await seoPage.checkStatusCode(200);
            await seoPage.checkUrlIsNotRedirected(url);
        });

        test("Page should be indexable", async () => {
            await seoPage.checkPageIsIndexable();
        });

        test("Hreflang should be absent", async () => {
            await seoPage.checkHreflangsAreAbsent();
        });
    });
}
