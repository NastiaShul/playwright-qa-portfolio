import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { otherBlogsRatingPages, ratingOtherHru } from "./data/otherBlogsRating.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const ratingPage of otherBlogsRatingPages[project] ?? []) {
    test.describe(`SEO: Other blogs rating [${project} / ${ratingPage.name}]`, () => {
        const url = `${BASE_URL}${ratingPage.path.replace("%hru%", ratingOtherHru)}`;
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
            test.fail(project === "BY", "Other blogs rating returns 404 on BY");
            await seoPage.checkStatusCode(200);
            await seoPage.checkUrlIsNotRedirected(url);
        });

        test("Page should be indexable", async () => {
            test.fail(project === "BY", "Other blogs rating returns 404 on BY");
            await seoPage.checkPageIsIndexable();
        });

        test("Hreflang should be absent", async () => {
            // On BY the page is 404 and has no hreflang, so only UA is expected to fail for now
            test.fail(project === "UA", "Hreflang is present on UA");
            await seoPage.checkHreflangsAreAbsent();
        });
    });
}
