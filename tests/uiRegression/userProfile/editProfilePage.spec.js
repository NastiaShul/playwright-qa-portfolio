import { test, expect } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../../../pages/auth.page";
import { ProfilePage } from "../../../pages/profile.page";
import { MainPage } from "../../../pages/main.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { secondUserInfo } from "../../api/utils/apiVariables";

const mail = secondUserInfo.email;
const password = secondUserInfo.password;

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const url = `${BASE_URL}${project === "UA" ? "uk" : project === "BY" ? "be" : "en"}`;
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

test("Check blog page elements should be displayed", async ({ page, isMobile }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);

    await test.step("Login to application", async () => {
        await page.goto(url);

        if (project === "INT") {
            await loginPage.userLoginInt(mail, password, isMobile);
        } else {
            await loginPage.userLogin(mail, password);
        }
    });

    await test.step("Open profile page", async () => {
        if (project === "INT") {
            await expect(loginPage.loginUserProfileIcon).toBeVisible();
            await loginPage.loginUserProfileIcon.click();
            await profilePage.userProfileLink.click();
        } else {
            await loginPage.loginUserProfileIcon.click();
            await profilePage.userProfileLink.click();
        }
        await expect(page).toHaveURL(/\/profile\//);
    });

    await test.step("Open edit profile page", async () => {
        await expect(profilePage.userProfileHeader).toBeVisible();
        await expect(profilePage.userProfileHeader).toBeVisible();

        await expect(profilePage.userUpdateProfileButton).toBeVisible();
        await expect(profilePage.userUpdateProfileButton).toBeVisible();
        await profilePage.checkElementIsClickable(profilePage.userUpdateProfileButton);
        await profilePage.userUpdateProfileButton.click();
        await expect(page).toHaveURL(/\/edit\//);

        await expect(profilePage.userUpdateProfileForm).toBeVisible();
        await expect(profilePage.userUpdateProfileForm).toBeVisible();
    });

    await test.step("Check avatar update form elements", async () => {
        await expect(profilePage.userUpdateProfileFormAvatar).toBeVisible();
        await expect(profilePage.userUpdateProfileFormAvatarButtons).toBeVisible();

        await expect(profilePage.uploadAvatarButton).toBeVisible();
        await profilePage.checkElementIsClickable(profilePage.uploadAvatarButton);
    });

    await test.step("Check profile update form elements", async () => {
        await expect(profilePage.userUpdateProfileFormAvatar).toBeVisible();
        await expect(profilePage.userUpdateProfileFormAvatarButtons).toBeVisible();

        await expect(profilePage.uploadAvatarButton).toBeVisible();
        await profilePage.checkElementIsClickable(profilePage.uploadAvatarButton);

        await expect(profilePage.userUpdateProfileFormMainInfo).toBeVisible();
        await expect(profilePage.userUpdateProfileFormMainInfoTitle).toBeVisible();

        await expect(profilePage.userUpdateProfileFormSocialNetworks).toBeVisible();
        await expect(profilePage.userUpdateProfileFormSocialNetworksTitle).toBeVisible();

        for (const [label, input] of Object.entries(profilePage.socialInputs)) {
            await test.step(`Check ${label} input is visible`, async () => {
                await expect(input).toBeVisible();
            });
        }

        await expect(profilePage.userUpdateProfileSaveChangesButton).toBeVisible();
        await profilePage.checkElementIsClickable(profilePage.userUpdateProfileSaveChangesButton);
    });

});

test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
        const html = await page.content();
        const htmlPath = testInfo.outputDir + '/page-snapshot.html';

        fs.writeFileSync(htmlPath, html);
    }
});