import { test, expect } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../../../pages/auth.page";
import { MainPage } from "../../../pages/main.page";
import { checkProject } from "../../api/utils/functions/checkProject";

const signupBtnTextMap = {
    UA: "Зареєструватись",
    BY: "Зарэгістравацца",
    INT: "S'inscrire"
};

const signupModalSubtitleMap = {
    UA: 'Ласкаво просимо до найбільшої спортивної спільноти України! 👋',
    BY: 'Сардэчна запрашаем у буйнешую спартыўную супольнасць Беларусі 👋',
    INT: 'Bienvenue dans la communauté des vrais fans de football !👋'
};

const signupModalPropsMap = {
    UA: [
        "Залишайте коментарі та пишіть блоги",
        "Оцінюйте будь-який контент: найкращий — більш помітний"
    ],
    BY: [
        "Пакідайце каментарыі і пішыце блогі",
        "Рэйтынгуйце любы кантэнт: найлепшы - больш заўважны"
    ],
    INT: [
        "Commentez l'actu et partagez vos réflexions dans les blogs !",
        "Discutez avec vos amis et vos rivaux, commentez l'actualité et partagez vos impressions dans les blogs !"
    ]
};

const emailFormText = "E-Mail";

const emailFormPlaceholderTextMap = {
    UA: "Ваш e-mail",
    BY: "Ваш e-mail",
    INT: "Votre e-mail"
};

const passwordFormTextMap = {
    UA: "Пароль",
    BY: "Пароль",
    INT: "Mot de passe"
};

const passwordFormPlaceholderTextMap = {
    UA: "Ваш пароль",
    BY: "Ваш пароль",
    INT: "Votre mot de passe"
};

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

const locales = { UA: "uk", BY: "be", INT: "fr" };
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

test("Signup modal elements should be displayed", async ({ page, isMobile }) => {
    const loginPage = new LoginPage(page);

    await test.step("Open login modal", async () => {
        await page.goto(url);

        if (project === "INT") {
            await loginPage.userLoginOpenModalInt(isMobile);
        } else {
            await loginPage.userLoginOpenModal();
        }

        await expect(loginPage.loginModal).toBeAttached();
        await expect(loginPage.loginModal).toBeVisible();
    });

    await test.step("Switch to singup form", async () => {
        const signupBtnText = signupBtnTextMap[project];

        await expect(loginPage.loginModalAuthTabs).toBeVisible();
        await loginPage.loginModalAuthTabSignup.click();

        await loginPage.checkElementIsClickable(loginPage.loginModalAuthTabSignup, signupBtnText);
        await loginPage.checkTabIsActive(loginPage.loginModalAuthTabSignup);
    });

    await test.step("Close login modal", async () => {
        await loginPage.checkElementIsClickable(loginPage.loginModalCloseButton);
    });

    await test.step("Check login modal subtitle text", async () => {
        const expectedSubtitle = signupModalSubtitleMap[project];
        const expectedPros = signupModalPropsMap[project];

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
            emailFormPlaceholderTextMap[project]
        );

        await loginPage.checkElementIsVisible(loginPage.loginPasswordField, passwordText);
        await expect(loginPage.loginPasswordField).toHaveAttribute(
            "placeholder",
            passwordFormPlaceholderTextMap[project]
        );
        await loginPage.checkElementIsClickable(loginPage.loginModalPasswordShowHideIcon);

        await loginPage.checkElementIsVisible(loginPage.loginSubmitButton, signupBtnTextMap[project]);
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