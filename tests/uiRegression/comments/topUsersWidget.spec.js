import { test, expect } from "@playwright/test";
import { MainPage } from "../../../pages/main.page";
import { WidgetsComponent } from "../../../pages/components/widgetsComponent";
import { checkProject } from "../../api/utils/functions/checkProject";

const BASE_URL = process.env.BASE_URL;
let project;
let isWidgetPresent = null;

const langPathMap = {
    UA: "uk",
    BY: "be",
    INT: "en"
};

test.use({ userAgent: "UIAutotest" });

test.describe("Check top users widget UI and behavior", () => {

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

        const widgetsComponent = new WidgetsComponent(page);

        if (isWidgetPresent === null) {
            try {
                await widgetsComponent.topUserWidget.waitFor({ state: 'visible', timeout: 2000 });
                isWidgetPresent = true;
            } catch {
                isWidgetPresent = false;
            }
        }

        test.skip(!isWidgetPresent, "Top users widget is not displayed on this project/locale due to low activity");
    });

    test("Check top users widget UI", async ({ page }) => {
        const widgetsComponent = new WidgetsComponent(page);

        await test.step("Scroll to Top Users widget", async () => {
            await widgetsComponent.scrollToTopUserWidget();
        });

        await test.step("Check Top Users UI elements", async () => {
            await widgetsComponent.checkTopUserWidgetUI();
        });
    });

    test("Click on top user and verify redirect", async ({ page }) => {
        const widgetsComponent = new WidgetsComponent(page);

        await widgetsComponent.scrollToTopUserWidget();

        const expectedPath = await widgetsComponent.getElementHref(widgetsComponent.topUserFirstItem);
        await widgetsComponent.topUserFirstItem.click();

        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain(expectedPath);
    });

});