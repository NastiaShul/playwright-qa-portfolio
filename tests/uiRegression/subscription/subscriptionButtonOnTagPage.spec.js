import { expect, test } from "@playwright/test";
import { TagPage } from "../../../pages/tag.page";
import { MainPage } from "../../../pages/main.page";
import { LoginPage } from "../../../pages/auth.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { authState } from "../../../src/utils/uiAuthHelper";

const BASE_URL = process.env.BASE_URL;
let project;

test.use({ userAgent: "UIAutotest" });

test.describe.configure({ retries: 2 });

test.describe("Subscription button on tag page", () => {

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page }) => {
        const mainPage = new MainPage(page);

        await authState(context, "user");

        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await mainPage.acceptConsent();

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
    });

    const tags = [
        { ua: "uk/football/person/erling-haaland/", by: "be/football/person/erling-haaland/", en: "en/persons/erling-haaland/" },
        { ua: "uk/football/club/liverpool/", by: "be/football/club/liverpool/", en: "en/clubs/liverpool/" },
        { ua: "uk/football/team/ukraine/", by: "be/football/team/belarus/", en: "en/team/usa/" },
        { ua: "uk/football/tournament/ucl/", by: "be/football/tournament/ucl/", en: "en/league/ucl/" }
    ];

    test("User can subscribe to multiple tags", async ({ page }) => {
        const tagPage = new TagPage(page);

        await test.step("Subscribe and login", async () => {
            const firstTag = getTagUrl(tags[0]);
            await page.goto(BASE_URL + firstTag);

            await tagPage.subscription.clickSubscriptionButton();
        });

        for (const tagPaths of tags) {
            const url = BASE_URL + getTagUrl(tagPaths);

            await test.step(`Subscribe to tag: ${url}`, async () => {
                await page.goto(url);

                const isSubscribed = await tagPage.subscription.isSubscribed();

                if (!isSubscribed) {
                    await tagPage.subscription.clickForSubscribeOnSubscriptionButton();
                    await expect(tagPage.subscription.activeSubscriptionButton).toBeVisible();
                } else {
                    await tagPage.subscription.checkSubscriptionButton();
                }
            });
        }
    });
});

function getTagUrl(tagPaths) {
    if (BASE_URL.includes("ua")) return tagPaths.ua;
    if (BASE_URL.includes("by")) return tagPaths.by;
    return tagPaths.en;
};