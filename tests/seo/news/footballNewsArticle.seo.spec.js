import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { footballNewsArticleStates } from "./data/footballNewsArticle.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const state of footballNewsArticleStates[project] ?? []) {
    test.describe(`SEO: Football news [${project} / ${state.name}]`, () => {
        for (const newsPage of state.pages) {
            test.describe(newsPage.name, () => {
                const url = `${BASE_URL}${newsPage.path}`;
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

                test("Hreflang should match the SEO spreadsheet", async () => {
                    test.fail(Boolean(state.hreflangBug), state.hreflangBug);
                    await seoPage.checkHreflangs(state.hreflangs);
                });
            });
        }
    });
}
