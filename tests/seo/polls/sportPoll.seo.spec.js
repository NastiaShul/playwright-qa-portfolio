import { test } from "@playwright/test";
import { SeoPage } from "../../../pages/seo.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { sportPollPages } from "./data/sportPoll.seo.data";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

for (const pollPage of sportPollPages[project] ?? []) {
    test.describe(`SEO: Sport poll page [${project} / ${pollPage.name}]`, () => {
        const url = `${BASE_URL}${pollPage.path}`;
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

        test("Page should be noindex", async () => {
            await seoPage.checkPageIsNoindex();
        });

        test("Hreflang should be absent", async () => {
            test.fail(["UA", "BY"].includes(project), "Known bug: hreflang present on UA/BY sport poll page");
            await seoPage.checkHreflangsAreAbsent();
        });
    });
}
