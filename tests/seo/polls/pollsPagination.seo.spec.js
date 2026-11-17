import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import {
    seoLocales,
    buildSeoUrl,
    buildProdUrl
} from "../../../src/locales/seoLocales";
import {
    pollsPaginationTemplate,
    pollsPaginationCanonicalTemplate,
    pollsPaginationProjects
} from "./data/pollsPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const locales = pollsPaginationProjects.includes(project) ? seoLocales[project] : [];

for (const locale of locales) {
    test.describe(`SEO: Polls list pagination [${project} / ${locale.lang}]`, () => {

        test.describe("Polls list page 2", () => {
            const url = buildSeoUrl(BASE_URL, locale, pollsPaginationTemplate);
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
                await seoPage.checkCanonicalLink(buildProdUrl(project, locale, pollsPaginationCanonicalTemplate));
            });

            test("Page should not have hreflang", async () => {
                await seoPage.checkHreflangsAreAbsent();
            });
        });
    });
}
