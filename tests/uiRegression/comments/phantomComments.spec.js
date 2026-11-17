import { test, expect } from "@playwright/test";
import { MainPage } from "../../../pages/main.page";
import { CommentsComponent, uniqueCommentText } from "../../../pages/components/commentsComponent";
import { authState } from "../../../src/utils/uiAuthHelper";
import { checkProject } from "../../api/utils/functions/checkProject";

const BASE_URL = process.env.BASE_URL;
let project;

const langPathMap = {
    UA: "uk",
    BY: "be",
    INT: "en"
};

const newsPageUrls = {
    UA: "uk/boxing/1000000375176-biy-dzhoshua-fyuri-mozhe-proyty-28-lystopada-u-velykiy-b/",
    BY: "be/football/1113088630-yasin-bara-u-saligorsku-stvorany-vydatnyya-umovy-menavita-d/",
    INT: "it/news/2026-09-02-gran-gala-del-calcio-2026-linter-fa-incetta-di-premi-dalla-difesa-alla-societa-4-nerazzur/"
};

const phantomUsersConfig = {
    UA: {
        uuid: "fd403d7d-1011-4aae-b98b-62c806760b42",
        profileUrl: "https://stage.ua.example.com/uk/profile/fd403d7d-1011-4aae-b98b-62c806760b42/",
        authorName: "phantom_userUA"
    },
    BY: {
        uuid: "33d0e3d1-6315-48b0-bd9f-87d1035e882e",
        profileUrl: "https://by.example.com/be/profile/33d0e3d1-6315-48b0-bd9f-87d1035e882e/",
        authorName: "phantom_userBY"
    },
    INT: {
        uuid: "e2ab7801-f6e7-45be-bc43-3c43835e90e2",
        profileUrl: "https://example.com/en/profile/e2ab7801-f6e7-45be-bc43-3c43835e90e2/",
        authorName: "phantom_userINT"
    }
};

test.use({ userAgent: "UIAutotest" });

test.describe("Moderator actions in comments", () => {

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page }) => {
        const mainPage = new MainPage(page);

        await authState(context, "admin");

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
        await new CommentsComponent(page).gotoWithActiveSession(`${BASE_URL}${langPath}`);

        await mainPage.acceptConsent();
    });

    test("Publish comment as phantom user via profile link", async ({ page }) => {
        const commentsComponent = new CommentsComponent(page);
        const newsUrl = newsPageUrls[project];
        const phantomUser = phantomUsersConfig[project];
        const commentText = uniqueCommentText("Phantom comment:");

        await test.step("Open news page and comments", async () => {
            await commentsComponent.gotoWithActiveSession(`${BASE_URL}${newsUrl}`);

            if (await commentsComponent.commentsCounterIcon.isVisible()) {
                await commentsComponent.commentsCounterIcon.click();
            }
            await expect(commentsComponent.commentFormWrapper).toBeVisible();
        });

        await test.step("Add and select phantom user via profile URL", async () => {
            await commentsComponent.openPhantomMenu();
            await commentsComponent.selectPhantomUserByLink(phantomUser.profileUrl, phantomUser.authorName);
        });

        await test.step("Verify phantom UUID is added to used_fantom_users in localStorage", async () => {
            await expect.poll(async () => {
                return await page.evaluate((targetId) => {
                    const raw = window.localStorage.getItem("used_fantom_users");
                    if (!raw) return false;
                    try {
                        const parsed = JSON.parse(raw);
                        return Array.isArray(parsed.data) && parsed.data.includes(targetId);
                    } catch {
                        return false;
                    }
                }, phantomUser.uuid);
            }, {
                message: `Expected '${phantomUser.uuid}' to be present in used_fantom_users localStorage`
            }).toBeTruthy();
        });

        await test.step("Send comment as phantom user", async () => {
            await commentsComponent.sendComment(commentText);
        });

        await test.step("Verify comment is published with phantom author name", async () => {
            await commentsComponent.checkCommentPublishedByAuthor(phantomUser.authorName, commentText);
        });
    });

    test("Publish comment with club super app tag (INT project only)", async ({ page }) => {
        test.skip(project !== "INT", "Club super apps tagging is available only for INT project");

        const commentsComponent = new CommentsComponent(page);
        const blogPostUrl = "en/blogs/two-real-madrid-transfers-nobody-noticed-who-are-oscar-naase/";
        const selectedApp = "FC Barcelona";
        const expectedSuperTag = "Barcelona Live";
        const commentText = uniqueCommentText("Barcelona Live comment:");

        await test.step("Open post page and open phantom menu", async () => {
            await commentsComponent.gotoWithActiveSession(`${BASE_URL}${blogPostUrl}`);

            if (await commentsComponent.commentsCounterIcon.isVisible()) {
                await commentsComponent.commentsCounterIcon.click();
            }
            await expect(commentsComponent.commentFormWrapper).toBeVisible();

            await commentsComponent.openPhantomMenu();
        });

        await test.step("Select club super app from dropdown", async () => {
            await commentsComponent.selectPhantomApp(selectedApp);
        });

        await test.step("Write and publish comment", async () => {
            await commentsComponent.sendComment(commentText);
        });

        await test.step("Verify published comment has super app bubble tag", async () => {
            await commentsComponent.checkCommentHasSuperTag(commentText, expectedSuperTag);
        });
    });

});