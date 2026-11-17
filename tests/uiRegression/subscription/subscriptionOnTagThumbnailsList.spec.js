import { test, expect } from "@playwright/test";
import { TagPage } from "../../../pages/tag.page";
import { MainPage } from "../../../pages/main.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { authState } from "../../../src/utils/uiAuthHelper";

const BASE_URL = process.env.BASE_URL;

test.use({ userAgent: "UIAutotest" });

test.describe.configure({ retries: 2 });

test.describe("Subscription to tags at thumbnails list on content page", () => {
    let project;

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page, isMobile }) => {
        const mainPage = new MainPage(page);

        await authState(context, isMobile ? "user2" : "user");

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

    const contentLinks = [
        {
            ua: "uk/football/1000000333055-leynders-pro-bernardu-silvu-yomu-zalyshylos-lyshe-6-tyzh/",
            by: "be/football/1113069565-liga-1-pszh-supracz-tuluzy/",
            en: "fr/news/2026-04-05-luis-enrique-a-tranche-la-compo-du-psg-contre-liverpool-se-dessine-deja-lequipe/",
        },
        {
            ua: "uk/football/blogs/3165341-fran-fernandes-shostyy-trener-karpat-yakyy-peremih-dynamo/",
            by: "be/football/blogs/3285995-praz-ekanomiyu-i-ne-tolki-moladzevaya-zbornaya-belarusi-exala-/",
            en: "en/blogs/has-giorgio-mamardashvili-been-any-better-than-alisson-as-li/",
        },
        {
            ua: "uk/football/polls/2000000000343-yakyy-z-turniriv-maye-buty-priorytetnishym-dlya-shakhtar/",
            by: "be/football/polls/2000000000011-czi-stane-minskae-dynama-chempiyonam-treczi-raz-zapar/",
            en: "it/polls/2026-04-05-come-finisce-napolimilan-fai-il-tuo-pronostico-e-vota/",
        },
    ];

    test("User can subscribe to tags from content page", async ({ page, isMobile }) => {
        const tagPage = new TagPage(page);

        for (const tagPaths of contentLinks) {
            const relativeUrl = getTagUrl(tagPaths);
            const targetUrl = new URL(relativeUrl, BASE_URL).href;

            await test.step(`Manage tag on: ${targetUrl}`, async () => {
                await page.goto(targetUrl, { waitUntil: "domcontentloaded" });

                const list = tagPage.subscription.tagThumbnailsList;

                await expect(list).toBeVisible();
                await list.scrollIntoViewIfNeeded();

                const isSubscribed = await tagPage.subscription.isTagThumbnailSubscribed();

                if (isSubscribed) {
                    await test.step("Reset: Unsubscribe first", async () => {
                        await tagPage.subscription.clickForUnsubscribeOnTagThumbnailSubscribeButton();
                        await expect(tagPage.subscription.tagThumbnailSubscribeButtonUnactive).toBeVisible();
                    });
                }

                await test.step("Action: Subscribe to tag", async () => {
                    await tagPage.subscription.clickForSubscribeOnTagThumbnailSubscribeButton();
                    await expect(tagPage.subscription.tagThumbnailSubscribeButtonActive).toBeVisible();
                });
            });
        }
    });
});

function getTagUrl(tagPaths) {
    if (BASE_URL.includes("ua")) return tagPaths.ua;
    if (BASE_URL.includes("by")) return tagPaths.by;
    return tagPaths.en;
}