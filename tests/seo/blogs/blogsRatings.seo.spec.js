import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { blogsRatingsPages } from "./data/blogsRatings.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const ratingsPage of blogsRatingsPages[project] ?? []) {
    test.describe(`SEO: Blogs ratings [${project} / ${ratingsPage.name}]`, () => {
        const url = `${BASE_URL}${ratingsPage.path}`;
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

        test("Hreflang should be absent", async () => {
            test.fail(project === "UA" || project === "BY", "Hreflang is present for uk/by projects");
            await seoPage.checkHreflangsAreAbsent();
        });
    });
}
