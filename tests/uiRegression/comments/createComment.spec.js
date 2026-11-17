import { expect, test } from "@playwright/test";
import fs from 'fs';
import path from 'path';
import { MainPage } from "../../../pages/main.page";
import { CommentsComponent, uniqueCommentText } from "../../../pages/components/commentsComponent";
import { authState } from "../../../src/utils/uiAuthHelper";
import { checkProject } from "../../api/utils/functions/checkProject";

const BASE_URL = process.env.BASE_URL;
let project;

const langPathMap = { UA: "uk", BY: "be", INT: "en" };

const testCases = [
    {
        type: "news",
        userRole: "user",
        openModal: true,
        urls: {
            UA: "uk/boxing/1000000375176-biy-dzhoshua-fyuri-mozhe-proyty-28-lystopada-u-velykiy-b/",
            BY: "be/football/1113088630-yasin-bara-u-saligorsku-stvorany-vydatnyya-umovy-menavita-d/",
            INT: "es/news/2026-09-11-cesc-fabregas-celebra-la-goleada-del-como-al-leipzig-en-la-champions-league-y-avisa-del-p/"
        }
    },
    {
        type: "post",
        userRole: "user2",
        openModal: true,
        urls: {
            UA: "uk/football/blogs/3180688-chomu-mbemo-dorhu-ta-yoro-maly-inshyy-dyzayn-futbolok-myu-u-li/",
            BY: "football/blogs/3288972-igrok-sbornoj-belarusi-poshel-v-polskij-klub-gde-fanaty-yaro-p/",
            INT: "ar/blogs/mn-dwr-hmshy-l-nqt-mhwry-m-ldhy-tghyr-blnsb-lfyrn-twrys-fy-b/"
        }
    },
    {
        type: "polls",
        userRole: "user",
        openModal: false,
        urls: {
            UA: "football/polls/2000000000468-khto-maye-vyhraty-zolotyy-myach/",
            BY: "be/betting/polls/2000000000008-kto-zabet-v-finale-ligi-chempionov202425-pszh-inter/",
            INT: "en/polls/2026-06-04-who-do-you-support-at-the-world-cup/"
        }
    }
];

test.use({ userAgent: "UIAutotest" });

test.describe("Create and publish comments", () => {

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page }, testInfo) => {
        const currentCase = testCases.find(tc => testInfo.title.includes(tc.type));
        const role = currentCase?.userRole || "user";

        await context.clearCookies();
        await authState(context, role);

        const storageConfig = {
            "user_subscription_modal": { time: Date.now(), data: { count: 3, isDisabled: true } },
            'subsOnboarding': { time: Date.now(), data: { maxShows: 1, shownCount: 10 } },
        };

        await context.addInitScript(({ storageConfig }) => {
            Object.entries(storageConfig).forEach(([key, value]) => {
                window.localStorage.setItem(key, JSON.stringify(value));
            });
            window.sessionStorage.setItem("webToAppShown", "false");
            window.sessionStorage.setItem("bookmakerGiftPopupStatus", "close");
        }, { storageConfig });

        const mainPage = new MainPage(page);
        await new CommentsComponent(page).gotoWithActiveSession(`${BASE_URL}${langPathMap[project] || "en"}`);
        await mainPage.acceptConsent();
    });

    for (const { type, openModal, urls } of testCases) {
        test(`Create and publish ${type} comment with reply`, async ({ page }) => {
            const commentsComponent = new CommentsComponent(page);
            const commentText = uniqueCommentText(`${type} comment:`);
            const replyText = uniqueCommentText(`${type} comment reply:`);

            await test.step(`Open ${type} page`, async () => {
                await commentsComponent.gotoWithActiveSession(`${BASE_URL}${urls[project]}`);
                if (openModal) {
                    await expect(commentsComponent.commentsCounterIcon).toBeVisible();
                    await commentsComponent.commentsCounterIcon.click();
                }
            });

            await test.step("Publish new comment", async () => {
                await commentsComponent.sendComment(commentText);
                await commentsComponent.checkCommentPublished(commentText);
            });

            await test.step("Reply to published comment", async () => {
                await commentsComponent.replyToComment(replyText);
                await commentsComponent.checkCommentPublished(replyText);
            });
        });
    }

});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const html = await page.content();
        await testInfo.attach('page-snapshot', { body: html, contentType: 'text/html' });
        fs.mkdirSync(testInfo.outputDir, { recursive: true });
        fs.writeFileSync(path.join(testInfo.outputDir, 'page-snapshot.html'), html);
    }
});