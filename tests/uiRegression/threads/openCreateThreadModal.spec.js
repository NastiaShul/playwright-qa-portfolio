import { test, expect } from "@playwright/test";
import { MainPage } from "../../../pages/main.page";
import { LoginPage } from "../../../pages/auth.page";
import { ThreadPage } from "../../../pages/thread.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { secondUserInfo } from "../../api/utils/apiVariables";

const BASE_URL = process.env.BASE_URL;
let project;

const USER_MAIL = secondUserInfo.email;
const USER_PASSWORD = secondUserInfo.password;

test.use({ userAgent: "UIAutotest" });

test.describe("Create thread modal actions", () => {

    test.describe.configure({ retries: 2 });

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

        await page.goto(BASE_URL + (project === "UA" ? "uk" : project === "BY" ? "be" : "en"), { waitUntil: 'domcontentloaded' });

        await mainPage.acceptConsent();
    });

    test("Open create thread modal", async ({ page, isMobile }) => {
        const loginPage = new LoginPage(page);
        const threadPage = new ThreadPage(page);

        await test.step("Login", async () => {
            if (project === "INT") {
                await loginPage.userLoginInt(USER_MAIL, USER_PASSWORD, isMobile);
            } else {
                await loginPage.userLogin(USER_MAIL, USER_PASSWORD);
            }
            await loginPage.userLoginValidate();
        });

        await test.step("Open create thread modal from user menu", async () => {
            await loginPage.openUserProfileMenu(isMobile);
            await threadPage.modalsComponent.openNewThreadModalFromUserMenu();
            await threadPage.modalsComponent.closeNewThreadModal();
        });

        await test.step("Open create thread modal from personal feed", async () => {
            const langPath = project === "UA" ? "uk" : project === "BY" ? "be" : "en";
            await page.goto(`${BASE_URL}${langPath}/personal-feed`);
            await threadPage.modalsComponent.openNewThreadModalFromOverlay();
            await threadPage.modalsComponent.closeNewThreadModal();
        });

        await test.step("Open create thread modal from main page", async () => {
            const langPath = project === "UA" ? "uk" : project === "BY" ? "be" : "en";
            await page.goto(`${BASE_URL}${langPath}`);
            await threadPage.modalsComponent.openNewThreadModalFromOverlay();
            await threadPage.modalsComponent.closeNewThreadModal();
        });

    });

});