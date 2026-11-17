import { test, expect } from "@playwright/test";
import { MainPage } from "../../../pages/main.page";
import { ThreadPage } from "../../../pages/thread.page";
import { checkProject } from "../../api/utils/functions/checkProject";

const BASE_URL = process.env.BASE_URL;
let project;

const breadcrumbUA = [
    "SportsApp",
    "Треди"
];

const breadcrumbBy = [
    "SportsApp",
    "Трэды"
];

const breadcrumbINT = [
    "SportsApp",
    "Threads"
];

const titleMap = {
    UA: "Треди",
    BY: "Трэды",
    INT: "Threads"
};

const threadIdMap = {
    UA: "3000000000215",
    BY: "3000000000007",
    INT: "3000000000002"
};

const langPathMap = {
    UA: "uk",
    BY: "be",
    INT: "en"
};

test.use({ userAgent: "UIAutotest" });

test.describe("Check threads page UI", () => {

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page }) => {
        const mainPage = new MainPage(page);

        const storageConfig = {
            "user_subscription_modal": {
                time: Date.now(),
                data: { count: 3, isDisabled: true }
            },
            'subsOnboarding': {
                time: Date.now(),
                data: { maxShows: 1, shownCount: 10 },
            },
        };

        const sessionValues = {
            webToAppShown: "false",
            bookmakerGiftPopupStatus: "close"
        };

        await context.addInitScript(({ storageConfig, sessionValues }) => {
            Object.entries(storageConfig).forEach(([key, value]) => {
                window.localStorage.setItem(key, JSON.stringify(value));
            });
            Object.entries(sessionValues).forEach(([key, value]) => {
                window.sessionStorage.setItem(key, value);
            });
        }, { storageConfig, sessionValues });

        const langPath = langPathMap[project] || "en";
        await page.goto(`${BASE_URL}${langPath}`, { waitUntil: 'domcontentloaded' });

        await mainPage.acceptConsent();
    });

    test("Open threads hub page and check UI", async ({ page }) => {
        const threadPage = new ThreadPage(page);
        const mainPage = new MainPage(page);
        const langPath = langPathMap[project] || "en";

        await test.step("Navigate to threads hub", async () => {
            const expectedUrl = `${BASE_URL}${langPath}/threads`;

            await page.goto(expectedUrl);
            await expect(page).toHaveURL(new RegExp(expectedUrl));
        });

        await test.step("Breadscrumbs should be displayed", async () => {
            const crumbs = project === "UA" ? breadcrumbUA : project === "BY" ? breadcrumbBy : breadcrumbINT;
            await mainPage.checkItemsInBreadcrumbs(crumbs, project);
        });

        await test.step("Check threads hub page title", async () => {
            await threadPage.checkThreadsHubPageTitle(titleMap[project]);
        });

        await test.step("Check thread card elements", async () => {
            await threadPage.checkCommonCardElements();

            const isBlogThread = await threadPage.isBlogThreadType();
            if (isBlogThread) {
                await threadPage.checkBlogHeaderElements();
            } else {
                await threadPage.checkAuthorHeaderElements();
            }

            await threadPage.checkThreadContentElements();
            await threadPage.checkThreadBottomPanelElements();
        });
    });

    test("Open thread by id page and check UI", async ({ page }) => {
        const threadPage = new ThreadPage(page);
        const mainPage = new MainPage(page);
        const langPath = langPathMap[project] || "en";

        await test.step("Navigate to thread by id page", async () => {
            const expectedUrl = `${BASE_URL}${langPath}/threads/${threadIdMap[project]}`;

            await page.goto(expectedUrl);
            await expect(page).toHaveURL(new RegExp(expectedUrl));
        });

        await test.step("Breadscrumbs should be displayed", async () => {
            const crumbs = project === "UA" ? breadcrumbUA : project === "BY" ? breadcrumbBy : breadcrumbINT;
            await mainPage.checkItemsInBreadcrumbs(crumbs, project);
        });

        await test.step("Check thread elements", async () => {
            await threadPage.checkOpenedThreadHeader();
            await threadPage.checkOpenedThreadContent();
            await threadPage.checkOpenedThreadFooter();

            await expect(threadPage.threadPageCommentsBlock).toBeVisible();
        });
    });

});