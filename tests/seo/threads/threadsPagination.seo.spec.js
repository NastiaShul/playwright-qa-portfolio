import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { threadsPaginationPages } from "./data/threadsPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const threadsPaginationPage of threadsPaginationPages[project] ?? []) {
    test.describe(`SEO: Threads list pagination [${project} / ${threadsPaginationPage.name}]`, () => {
        const url = `${BASE_URL}${threadsPaginationPage.path}`;
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

        test("Page should be noindex", async () => {
            await seoPage.checkPageIsNoindex();
        });

        test("Hreflang should be absent", async () => {
            await seoPage.checkHreflangsAreAbsent();
        });
    });
}
