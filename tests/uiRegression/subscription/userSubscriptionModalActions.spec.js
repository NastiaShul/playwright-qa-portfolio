import { test, expect } from "@playwright/test";
import { TagPage } from "../../../pages/tag.page";
import { MainPage } from "../../../pages/main.page";
import { LoginPage } from "../../../pages/auth.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { authState } from "../../../src/utils/uiAuthHelper";

const BASE_URL = process.env.BASE_URL;
let project;

test.use({ userAgent: "UIAutotest" });

test.describe("User subscription modal actions", () => {

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page, isMobile }) => {
        const mainPage = new MainPage(page);

        await authState(context, isMobile ? "user2" : "user");

        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await mainPage.acceptConsent();

        const storageConfig = {
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
        { ua: "uk/football/person/salah/", by: "be/football/person/salah/", en: "en/persons/salah/" },
        { ua: "uk/football/club/liverpool/", by: "be/football/club/liverpool/", en: "en/clubs/liverpool/" },
        { ua: "uk/football/team/ukraine/", by: "be/football/team/belarus/", en: "en/team/usa/" },
        { ua: "uk/football/tournament/ucl/", by: "be/football/tournament/ucl/", en: "en/league/ucl/" }
    ];

    test("User subscription modal actions", async ({ page }) => {
        const tagPage = new TagPage(page);

        await test.step("Close user subscription modal", async () => {
            await page.goto(BASE_URL + getTagUrl(tags[0]));

            const isSubscribed = await tagPage.subscription.isSubscribed();

            if (isSubscribed) {
                await tagPage.subscription.clickForUnsubscribeOnSubscriptionButton();
                await tagPage.subscription.checkUnactiveSubscriptionButton();
            }

            await tagPage.subscription.clickForSubscribeOnSubscriptionButton();
            await tagPage.subscription.modalComponent.checkSubscriptionModalVisible();
            await tagPage.subscription.modalComponent.closeSubscriptionModal();
        });

        await test.step("Open personal feed from modal", async () => {
            await page.goto(BASE_URL + getTagUrl(tags[1]));

            const isSubscribed = await tagPage.subscription.isSubscribed();

            if (isSubscribed) {
                await tagPage.subscription.clickForUnsubscribeOnSubscriptionButton();
                await tagPage.subscription.checkUnactiveSubscriptionButton();
            }

            await tagPage.subscription.clickForSubscribeOnSubscriptionButton();
            await tagPage.subscription.modalComponent.checkSubscriptionModalVisible();

            await tagPage.subscription.modalComponent.openPersonalPage();

            await expect(page).toHaveURL(/.*personal-feed.*/);
        });

        await test.step("Open subscription settings from modal", async () => {
            await page.goto(BASE_URL + getTagUrl(tags[2]));

            const isSubscribed = await tagPage.subscription.isSubscribed();

            if (isSubscribed) {
                await tagPage.subscription.clickForUnsubscribeOnSubscriptionButton();
                await tagPage.subscription.checkUnactiveSubscriptionButton();
            }

            await tagPage.subscription.clickForSubscribeOnSubscriptionButton();
            await tagPage.subscription.modalComponent.checkSubscriptionModalVisible();

            await tagPage.subscription.modalComponent.openSubscriptionSettings();

            await tagPage.subscription.modalComponent.waitForOnboardingVisible();
        });
    });
});

function getTagUrl(tagPaths) {
    if (BASE_URL.includes("ua")) return tagPaths.ua;
    if (BASE_URL.includes("by")) return tagPaths.by;
    return tagPaths.en;
};