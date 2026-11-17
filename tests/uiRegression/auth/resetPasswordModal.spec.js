import { test, expect } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../../../pages/auth.page";
import { MainPage } from "../../../pages/main.page";
import { checkProject } from "../../api/utils/functions/checkProject";

const resetPasswordModalTitleMap = {
    UA: "Створення нового пароля",
    BY: "Стварэнне новага пароля",
    INT: "Crea una nuova pasword"
};

const emailFormTextMap = {
    UA: "E-Mail",
    BY: "E-Mail",
    INT: "Email"
};

const emailFormPlaceholderTextMap = {
    UA: "Ваш e-mail",
    BY: "Ваш e-mail",
    INT: "La tua email"
};

const resetPasswordSubmitButtonMap = {
    UA: "Скинути пароль",
    BY: "Скінуць пароль",
    INT: "Recupera password"
};


const returnLinkTextMap = {
    UA: [
        "Повернутись на ",
        "сторінку авторизації"
    ],
    BY: [
        "Вярнуцца на ",
        "старонку аўтарызацыi"
    ],
    INT: [
        "Torna a pagina ",
        "di accesso"
    ]
};

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

const locales = { UA: "uk", BY: "be", INT: "it" };
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

test("Reset password modal elements should be displayed", async ({ page, isMobile }) => {
    const loginPage = new LoginPage(page);

    await test.step("Open login modal", async () => {
        await page.goto(url);

        if (project === "INT") {
            await loginPage.userLoginOpenModalInt(isMobile);
        } else {
            await loginPage.userLoginOpenModal();
        }
        await expect(loginPage.loginModal).toBeAttached();
        await loginPage.checkElementIsVisible(loginPage.loginModal);
    });

    await test.step("Switch to forgot password form", async () => {
        await loginPage.checkElementIsClickable(loginPage.loginModalAuthForgotPasswordLink);
        await loginPage.loginModalAuthForgotPasswordLink.click();

        await loginPage.checkElementIsVisible(loginPage.resetPasswordModal);
    });

    await test.step("Check reset password modal elements", async () => {
        const expectedReturnLink = returnLinkTextMap[project];

        await expect(loginPage.resetPasswordModalTitle).toBeVisible();
        await loginPage.checkElementIsVisible(loginPage.resetPasswordModalTitle, resetPasswordModalTitleMap[project]);

        await loginPage.checkElementIsVisible(loginPage.resetPasswordEmailField);
        await loginPage.checkElementIsVisible(loginPage.resetPasswordEmailField, emailFormTextMap[project]);
        await expect(loginPage.resetPasswordEmailField).toHaveAttribute(
            "placeholder",
            emailFormPlaceholderTextMap[project]
        );

        await loginPage.checkElementIsVisible(loginPage.resetPasswordSubmitButton, resetPasswordSubmitButtonMap[project]);
        await loginPage.checkTabIsDisabled(loginPage.resetPasswordSubmitButton);

        await loginPage.checkElementIsClickable(loginPage.resetPasswordComeBackToLoginLink);
        for (const text of expectedReturnLink) {
            await expect(loginPage.resetPasswordComeBackToLoginLink.getByText(text)).toBeVisible();
        }

    });
});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const html = await page.content();
        const htmlPath = testInfo.outputDir + '/page-snapshot.html';

        fs.writeFileSync(htmlPath, html);
    }
});