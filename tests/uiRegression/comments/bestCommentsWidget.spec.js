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

test.describe("Check best comments widget UI", () => {

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
                await widgetsComponent.bestCommentsWidget.waitFor({ state: 'visible', timeout: 2000 });
                isWidgetPresent = true;
            } catch {
                isWidgetPresent = false;
            }
        }

        test.skip(!isWidgetPresent, "Best comments widget is not displayed on this project/locale due to low activity");
    });

    test("Check best comments widget UI", async ({ page }) => {
        const widgetsComponent = new WidgetsComponent(page);

        await test.step("Scroll to widget", async () => {
            await widgetsComponent.scrollToBestCommentsWidget();
        });

        await test.step("Check best comments widget UI elements", async () => {
            await widgetsComponent.checkBestCommentsWidgetUI();
        });
    });

    test("Check comment link leads to the material", async ({ page }) => {
        const widgetsComponent = new WidgetsComponent(page);
        const langPath = langPathMap[project] || "en";

        await widgetsComponent.scrollToBestCommentsWidget();

        await expect(widgetsComponent.bestCommentsWidgetItemContentLink).toHaveAttribute(
            "href",
            new RegExp(`/${langPath}/(news|blogs|threads)/[^/]+`)
        );
    });

    test("Check author link leads to the profile", async ({ page }) => {
        const widgetsComponent = new WidgetsComponent(page);
        const langPath = langPathMap[project] || "en";

        await widgetsComponent.scrollToBestCommentsWidget();

        await expect(widgetsComponent.bestCommentsWidgetAuthorLink).toHaveAttribute(
            "href",
            new RegExp(`/${langPath}/profile/[\\w-]+/?$`)
        );
    });

    test("Check tabs switching behavior", async ({ page }) => {
        const widgetsComponent = new WidgetsComponent(page);

        await widgetsComponent.scrollToBestCommentsWidget();

        const tabsCount = await widgetsComponent.bestCommentsWidgetTabs.locator('.swiper-slide').count();
        if (tabsCount < 2) {
            test.skip(true, `Not enough tabs to test switching. Current tabs count: ${tabsCount}`);
            return;
        }

        await widgetsComponent.checkTabDayIsActive();
        await widgetsComponent.switchBestCommentsToWeek();
        await widgetsComponent.checkTabWeekIsActive();
        await widgetsComponent.checkElementIsVisible(widgetsComponent.bestCommentsWidgetCommentsList);

        await widgetsComponent.switchBestCommentsToDay();
        await widgetsComponent.checkTabDayIsActive();
    });

});