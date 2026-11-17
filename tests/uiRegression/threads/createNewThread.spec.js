import { test, expect } from "@playwright/test";
import { faker } from '@faker-js/faker';
import { MainPage } from "../../../pages/main.page";
import { ThreadPage } from "../../../pages/thread.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { authState } from "../../../src/utils/uiAuthHelper";

const BASE_URL = process.env.BASE_URL;
let project;

test.use({ userAgent: "UIAutotest" });

const createThreadButtonTextMap = {
    UA: "Опублікувати",
    BY: "Апублiкаваць",
    INT: "Pubblica"
};

test.describe("Create and publish a new thread successfully", () => {

    test.beforeAll(async () => {
        project = await checkProject(BASE_URL);
    });

    test.beforeEach(async ({ context, page }) => {
        const mainPage = new MainPage(page);

        await authState(context, "user");

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

        await page.goto(BASE_URL + (project === "UA" ? "uk" : project === "BY" ? "be" : "it"), { waitUntil: 'domcontentloaded' });

        await mainPage.acceptConsent();
    });

    test("Create and publish a new thread successfully", async ({ page }) => {
        const threadPage = new ThreadPage(page);

        await test.step("Open create thread modal from main page", async () => {
            const langPath = project === "UA" ? "uk" : project === "BY" ? "be" : "it";
            await page.goto(`${BASE_URL}${langPath}`, { waitUntil: 'domcontentloaded' });

            await threadPage.modalsComponent.openNewThreadModalFromOverlay();
        });

        await test.step("Check thread modal UI", async () => {
            const expectedText = createThreadButtonTextMap[project];
            await threadPage.modalsComponent.checkNewThreadModalUI(expectedText);
        });

        await test.step("Fill and publish new thread", async () => {
            const expectedText = createThreadButtonTextMap[project];
            const uniqueThreadText = `new test thread ${faker.animal.cat()}`;

            await threadPage.modalsComponent.fillThreadContent(uniqueThreadText);
            await threadPage.modalsComponent.submitNewThread(expectedText); 

            await threadPage.modalsComponent.goToNewThread();
            await expect(page).toHaveURL(/.*\/threads\/\d+/);

            await expect(page.getByText(uniqueThreadText).first()).toBeVisible();
        });

    });

});