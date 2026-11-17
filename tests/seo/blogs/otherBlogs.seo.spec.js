import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import {
    blogsOtherHru,
    noBlogsOtherHru,
    buildOtherBlogsHreflangs,
    otherBlogsPages
} from "./data/otherBlogs.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

const buildOtherBlogsUrl = (otherBlogsPage, hru) => `${BASE_URL}${otherBlogsPage.path.replace("%hru%", hru)}`;

for (const otherBlogsPage of otherBlogsPages[project] ?? []) {
    test.describe(`SEO: Other tag blogs tab [${project} / ${otherBlogsPage.name}]`, () => {

        test.describe("Other tag with 11+ blogs", () => {
            const url = buildOtherBlogsUrl(otherBlogsPage, blogsOtherHru);
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
                await seoPage.checkHreflangs(buildOtherBlogsHreflangs(blogsOtherHru));
            });
        });

        test.describe("Other tag without blogs", () => {
            const url = buildOtherBlogsUrl(otherBlogsPage, noBlogsOtherHru[project]);
            let seoPage;

            test.beforeAll(async () => {
                seoPage = SeoPage.request();
                await seoPage.open(url);
            });

            test.afterAll(async () => {
                await seoPage?.close();
            });

            test("Page should return 404", async () => {
                await seoPage.checkStatusCode(404);
            });

            test("Page should be noindex", async () => {
                await seoPage.checkPageIsNoindex();
            });
        });
    });
}
