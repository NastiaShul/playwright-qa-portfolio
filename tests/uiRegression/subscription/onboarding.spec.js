import { test, expect } from "@playwright/test";
import { TagPage } from "../../../pages/tag.page";
import { LoginPage } from "../../../pages/auth.page";
import { MainPage } from "../../../pages/main.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { secondUserInfo } from "../../api/utils/apiVariables";

const BASE_URL = process.env.BASE_URL;
const USER_MAIL = secondUserInfo.email;
const USER_PASSWORD = secondUserInfo.password;

test.use({ userAgent: "UIAutotest" });

test.describe.configure({ retries: 2 });

test.describe("Subscriptions Onboarding Flow", () => {
    let project;

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page }) => {
        const mainPage = new MainPage(page);

        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await mainPage.acceptConsent();

        const storageConfig = {
            "user_subscription_modal": {
                time: Date.now(),
                data: { count: 3, isDisabled: true }
            }
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

    test("User catch onboarding modal", async ({ page, isMobile }) => {
        const tagPage = new TagPage(page);
        const loginPage = new LoginPage(page);
        const modal = tagPage.subscription.modalComponent;

        await test.step("User catch onboarding modal after login", async () => {
            if (project === "INT") {
                await loginPage.userLoginInt(USER_MAIL, USER_PASSWORD, isMobile);
            } else {
                await loginPage.userLogin(USER_MAIL, USER_PASSWORD);
            }

            await expect(loginPage.loginModal).toBeHidden();

            await modal.waitForOnboardingVisible();
            await modal.closeOnboarding();
        });

        await test.step("User catch onboarding from subscriptions link", async () => {
            const personalizationUrl = BASE_URL.endsWith('/')
                ? `${BASE_URL}personalization`
                : `${BASE_URL}/personalization`;

            await page.goto(personalizationUrl);

            await modal.waitForOnboardingVisible();
            await modal.closeOnboarding();
        });

        await test.step("User catch onboarding from club widget", async () => {
            const widgets = tagPage.widgets;
            if (await widgets.clubsWidget.isVisible()) {
                await widgets.clickOnbordingButton();

                await modal.waitForOnboardingVisible();
                await modal.closeOnboarding();
            }
        });

        await test.step("User catch onboarding from club widget at match center", async () => {
            await page.goto(BASE_URL + "football/match/");

            const widgets = tagPage.widgets;
            if (await widgets.clubsWidget.isVisible()) {
                await widgets.clickOnbordingButton();

                await modal.waitForOnboardingVisible();
                await modal.closeOnboarding();
            }
        });
    });

});