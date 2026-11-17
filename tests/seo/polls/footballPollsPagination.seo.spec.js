import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { footballPollsPaginationPages } from "./data/footballPollsPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const pollsPaginationPage of footballPollsPaginationPages[project] ?? []) {
    test.describe(`SEO: Football polls list pagination [${project} / ${pollsPaginationPage.name}]`, () => {
        const url = `${BASE_URL}${pollsPaginationPage.path}`;
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

        test("Canonical should point to polls list", async () => {
            await seoPage.checkCanonicalLink(pollsPaginationPage.canonical);
        });

        test("Hreflang should be absent", async () => {
            await seoPage.checkHreflangsAreAbsent();
        });
    });
}
