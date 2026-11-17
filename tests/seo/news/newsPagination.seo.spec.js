import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import {
    seoLocales,
    buildSeoUrl,
    buildProdUrl
} from "../../../src/locales/seoLocales";
import {
    newsPaginationTemplate,
    newsPaginationCanonicalTemplate,
    newsPaginationProjects
} from "./data/newsPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const locales = newsPaginationProjects.includes(project) ? seoLocales[project] : [];

for (const locale of locales) {
    test.describe(`SEO: News feed pagination [${project} / ${locale.lang}]`, () => {

        test.describe("News feed page 2", () => {
            const url = buildSeoUrl(BASE_URL, locale, newsPaginationTemplate);
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

            test("Canonical should point to news feed", async () => {
                await seoPage.checkCanonicalLink(buildProdUrl(project, locale, newsPaginationCanonicalTemplate));
            });

            test("Page should not have hreflang", async () => {
                await seoPage.checkHreflangsAreAbsent();
            });
        });
    });
}
