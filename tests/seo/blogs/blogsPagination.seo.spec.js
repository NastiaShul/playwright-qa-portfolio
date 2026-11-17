import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import {
    seoLocales,
    buildSeoUrl,
    buildProdUrl
} from "../../../src/locales/seoLocales";
import {
    blogsPaginationTemplate,
    blogsPaginationCanonicalTemplate,
    blogsPaginationProjects
} from "./data/blogsPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const locales = blogsPaginationProjects.includes(project) ? seoLocales[project] : [];

for (const locale of locales) {
    test.describe(`SEO: Blogs feed pagination [${project} / ${locale.lang}]`, () => {

        test.describe("Blogs feed page 2", () => {
            const url = buildSeoUrl(BASE_URL, locale, blogsPaginationTemplate);
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

            test("Canonical should point to blogs feed", async () => {
                await seoPage.checkCanonicalLink(buildProdUrl(project, locale, blogsPaginationCanonicalTemplate));
            });

            test("Page should not have hreflang", async () => {
                await seoPage.checkHreflangsAreAbsent();
            });
        });
    });
}
