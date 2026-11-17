import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { buildSubdomainUrl } from "../../../src/locales/seoLocales";
import { mainPages, mainSubfolderPages } from "./data/mainPage.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const mainPage of mainPages[project] ?? []) {
    test.describe(`SEO: Main page [${project} / ${mainPage.name}]`, () => {
        const url = buildSubdomainUrl(BASE_URL, mainPage.subdomain, mainPage.path);
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
            await seoPage.checkHreflangs(mainPage.hreflangs);
        });
    });
}

for (const subfolderPage of mainSubfolderPages[project] ?? []) {
    test.describe(`SEO: Main page subfolder [${project} / ${subfolderPage.name}]`, () => {
        const url = `${BASE_URL}${subfolderPage.path}`;
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

        test("Canonical should point to the language subdomain", async () => {
            await seoPage.checkCanonicalLink(subfolderPage.canonical);
        });
    });
}
