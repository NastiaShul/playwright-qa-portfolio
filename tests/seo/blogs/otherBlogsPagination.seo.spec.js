import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import {
    paginatedBlogsOtherHru,
    otherBlogsPaginationPages
} from "./data/otherBlogsPagination.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const paginationPage of otherBlogsPaginationPages[project] ?? []) {
    test.describe(`SEO: Other tag blogs pagination [${project} / ${paginationPage.name}]`, () => {

        test.describe("Other tag blogs page 2", () => {
            const url = `${BASE_URL}${paginationPage.path.replace("%hru%", paginatedBlogsOtherHru)}`;
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

            test("Canonical should point to other tag blogs tab", async () => {
                await seoPage.checkCanonicalLink(paginationPage.canonical.replace("%hru%", paginatedBlogsOtherHru));
            });

            test("Page should not have hreflang", async () => {
                await seoPage.checkHreflangsAreAbsent();
            });
        });
    });
}
