import { test, expect } from "@playwright/test";
import { MainPage } from "../../../pages/main.page";
import { LoginPage } from "../../../pages/auth.page";
import { ThreadPage } from "../../../pages/thread.page";
import { ModalsComponent } from "../../../pages/components/modalsComponent";
import { uniqueCommentText } from "../../../pages/components/commentsComponent";
import { checkProject } from "../../api/utils/functions/checkProject";
import { secondUserInfo } from "../../api/utils/apiVariables";

const BASE_URL = process.env.BASE_URL;
let project;

const langPathMap = {
    UA: "uk",
    BY: "be",
    INT: "en"
};

const USER_MAIL = secondUserInfo.email;
const USER_PASSWORD = secondUserInfo.password;

test.use({ userAgent: "UIAutotest" });

test.describe("Test thread comment modal UI", () => {

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

    test("Open threads hub page, verify comments modal UI and send comment", async ({ page, isMobile }) => {
        const threadPage = new ThreadPage(page);
        const modalsComponent = new ModalsComponent(page);
        const loginPage = new LoginPage(page);
        const langPath = langPathMap[project] || "en";
        const commentText = uniqueCommentText("Test comment");

        await test.step("Login", async () => {
            if (project === "INT") {
                await loginPage.userLoginInt(USER_MAIL, USER_PASSWORD, isMobile);
            } else {
                await loginPage.userLogin(USER_MAIL, USER_PASSWORD, isMobile);
            }
            await loginPage.userLoginValidate();
        });

        await test.step("Navigate to threads hub", async () => {
            const expectedUrl = `${BASE_URL}${langPath}/threads`;
            await page.goto(expectedUrl);
            await expect(page).toHaveURL(new RegExp(expectedUrl));
        });

        await test.step("Open thread comments modal", async () => {
            await threadPage.threadCardComments.first().click();
            await modalsComponent.waitForThreadCommentModalVisible();
        });

        await test.step("Verify comments modal UI elements", async () => {
            await modalsComponent.checkThreadCommentModalUI();
        });

        await test.step("Type and send a comment", async () => {
            await modalsComponent.comments.sendComment(commentText);
        });

        await test.step("Verify published comment in modal", async () => {
            await modalsComponent.comments.checkCommentPublished(commentText);
        });

        await test.step("Close comments modal", async () => {
            await modalsComponent.closeThreadCommentModal();
        });
    });
});