import { test, expect } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../../../pages/auth.page";
import { MainPage } from "../../../pages/main.page";
import { checkProject } from "../../api/utils/functions/checkProject";

const loginBtnTextMap = {
    UA: "Увійти",
    BY: "Увайсці",
    INT: "Anmelden"
};

const loginModalSubtitleMap = {
    UA: 'Раді знову бачити вас на "Трибуні"👏',
    BY: 'Радыя зноў бачыць вас на "Трыбуне"👏',
    INT: 'Schön, Sie wieder bei uns zu sehen!👏'
};

const loginModalPropsMap = {
    UA: [
        "Залишайте коментарі та пишіть блоги",
        "Оцінюйте будь-який контент: найкращий — більш помітний"
    ],
    BY: [
        "Пакідайце каментарыі і пішыце блогі",
        "Рэйтынгуйце любы кантэнт: найлепшы - больш заўважны"
    ],
    INT: [
        "Kommentieren Sie die Nachrichten und teilen Sie Ihre Gedanken in Blogs mit!",
        "Chatten Sie mit Freunden und Rivalen, kommentieren Sie Nachrichten und teilen Sie Ihre Gedanken in Blogs!"
    ]
};

const emailFormText = "E-Mail";

const emailFormPlaceholderText = {
    UA: "Ваш e-mail",
    BY: "Ваш e-mail",
    INT: "Ihre E-Mail"
};

const passwordFormTextMap = {
    UA: "Пароль",
    BY: "Пароль",
    INT: "Passwort"
};

const passwordFormPlaceholderText = {
    UA: "Ваш пароль",
    BY: "Ваш пароль",
    INT: "Ihr Passwort"
};

const passwordFormForgotTextMap = {
    UA: "Забули?",
    BY: "Забылi?",
    INT: "Vergessen?"
};

const formSubmitButtonTextMap = {
    UA: "Увійти",
    BY: "Увайсці",
    INT: "Anmelden"
};

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

const locales = { UA: "uk", BY: "be", INT: "de" };
const url = `${BASE_URL}${locales[project]}`;

const sessionValues = {
    webToAppShown: "false",
    bookmakerGiftPopupStatus: "close"
};

test.use({ userAgent: "UIAutotest" });

test.beforeEach(async ({ context, page }) => {
    const mainPage = new MainPage(page);
    const onboardingData = {
        time: Date.now(),
        data: { maxShows: 1, shownCount: 1 }
    };

    await context.addInitScript((values) => {
        Object.entries(values).forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
        });
    }, sessionValues);

    await context.addInitScript((data) => {
        localStorage.setItem("subsOnboarding", JSON.stringify(data));
    }, onboardingData);

    await page.goto(url);
    await mainPage.acceptConsent();
});

test("Login modal elements should be displayed", async ({ page, isMobile }) => {
    const loginPage = new LoginPage(page);

    await test.step("Open login modal", async () => {
        await page.goto(url);

        // await page.evaluate((values) => {
        //     Object.entries(values).forEach(([key, value]) => {
        //         sessionStorage.setItem(key, value);
        //     });
        // }, sessionValues);

        if (project === "INT") {
            await loginPage.userLoginOpenModalInt(isMobile);
        } else {
            await loginPage.userLoginOpenModal();
        }
        await expect(loginPage.loginModal).toBeAttached();
        await expect(loginPage.loginModal).toBeVisible();
    });

    await test.step("Check login modal elements", async () => {
        const loginBtnText = loginBtnTextMap[project];

        await expect(loginPage.loginModalAuthTabs).toBeVisible();
        await loginPage.checkElementIsClickable(loginPage.loginModalAuthTabLogin, loginBtnText);
        await loginPage.checkTabIsActive(loginPage.loginModalAuthTabLogin);
    });

    await test.step("Close login modal", async () => {
        await loginPage.checkElementIsClickable(loginPage.loginModalCloseButton);
    });

    await test.step("Check login modal subtitle text", async () => {
        const expectedSubtitle = loginModalSubtitleMap[project];
        const expectedPros = loginModalPropsMap[project];

        await expect(
            page.getByText(expectedSubtitle, { exact: false })
        ).toBeVisible();
        await loginPage.checkElementIsVisible(loginPage.loginModalPros);

        for (const text of expectedPros) {
            await expect(loginPage.loginModalPros.getByText(text)).toBeVisible();
        }
    });

    await test.step("Check login modal form", async () => {
        const emailText = emailFormText;
        const passwordText = passwordFormTextMap[project];

        await loginPage.checkElementIsVisible(loginPage.loginEmailField, emailText);
        await expect(loginPage.loginEmailField).toHaveAttribute(
            "placeholder",
            emailFormPlaceholderText[project]
        );

        await loginPage.checkElementIsVisible(loginPage.loginPasswordField, passwordText);
        await expect(loginPage.loginPasswordField).toHaveAttribute(
            "placeholder",
            passwordFormPlaceholderText[project]
        );
        await loginPage.checkElementIsClickable(loginPage.loginModalPasswordShowHideIcon);
        await loginPage.checkElementIsClickable(loginPage.loginModalAuthForgotPasswordLink, passwordFormForgotTextMap[project]);

        await loginPage.checkElementIsVisible(loginPage.loginSubmitButton, formSubmitButtonTextMap[project]);
        await loginPage.checkTabIsDisabled(loginPage.loginSubmitButton);

    });
});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const html = await page.content();
        const htmlPath = testInfo.outputDir + '/page-snapshot.html';

        fs.writeFileSync(htmlPath, html);
    }
});