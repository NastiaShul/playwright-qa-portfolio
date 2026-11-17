import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import {
    seoLocales,
    buildSeoUrl,
    buildProdUrl
} from "../../../src/locales/seoLocales";
import {
    blogPaginationTemplate,
    blogPaginationCanonicalTemplate,
    paginatedBlogHrus,
    unpublishedLocales
} from "./data/blogPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const locales = seoLocales[project].filter(({ lang }) => !unpublishedLocales.includes(lang));

for (const locale of locales) {
    test.describe(`SEO: Blog pagination [${project} / ${locale.lang}]`, () => {

        test.describe("Blog page 2", () => {
            const blogHru = paginatedBlogHrus[project];
            const url = buildSeoUrl(BASE_URL, locale, blogPaginationTemplate, blogHru);
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

            test("Canonical should point to blog main page", async () => {
                await seoPage.checkCanonicalLink(buildProdUrl(project, locale, blogPaginationCanonicalTemplate, blogHru));
            });

            test("Page should not have hreflang", async () => {
                await seoPage.checkHreflangsAreAbsent();
            });
        });
    });
}
