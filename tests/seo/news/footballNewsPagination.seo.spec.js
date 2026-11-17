import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { footballNewsPaginationPages } from "./data/footballNewsPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const footballNewsPaginationPage of footballNewsPaginationPages[project] ?? []) {
    test.describe(`SEO: Football news feed pagination [${project} / ${footballNewsPaginationPage.name}]`, () => {
        const url = `${BASE_URL}${footballNewsPaginationPage.path}`;
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

        test("Canonical should point to football news feed", async () => {
            await seoPage.checkCanonicalLink(footballNewsPaginationPage.canonical);
        });

        test("Hreflang should be absent", async () => {
            await seoPage.checkHreflangsAreAbsent();
        });
    });
}

