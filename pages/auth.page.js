import { expect, test } from "@playwright/test";
import { MainPage } from "./main.page";

export class LoginPage extends MainPage {
    constructor(page) {
        super(page);

        // entry
        this.headerMenuIcon = page.locator('div[class*="header__menu-icon"] svg');

        // modal
        this.loginModal = page.locator('div[class*="_modal__content_"][class*="_auth_"]');
        this.loginModalCloseButton = this.loginModal.locator('div[class*="_auth-header__close-icon"]').locator('svg');

        this.loginModalSubtitle = this.loginModal.locator('span[class*="_text--subtitle"]');
        this.loginModalPros = this.loginModal.locator('div[class*="_auth__pros"]').first();

        // fields
        this.loginModalForm = this.loginModal.locator('form');
        this.loginEmailField = this.loginModalForm.locator('input[type="email"]');
        this.loginPasswordField = this.loginModalForm.locator('input[type="password"]');
        this.loginModalAuthForgotPasswordLink = this.loginModal.locator('[class*="_auth__forgot-password"]');
        this.loginModalPasswordShowHideIcon = this.loginPasswordField.locator('xpath=..').locator('svg');
        this.loginSubmitButton = this.loginModal.locator('button[class*="_auth__btns__btn_"]');

        // reset form
        this.resetPasswordModal = page.locator('div[class*="_reset-password_"]');
        this.resetPasswordModalTitle = this.resetPasswordModal.locator('span[class*="_reset-password__title"]');
        this.resetPasswordEmailField = this.resetPasswordModal.locator('input[type="email"]');
        this.resetPasswordSubmitButton = this.resetPasswordModal.locator('button');
        this.resetPasswordComeBackToLoginLink = this.resetPasswordModal.locator('span[class*="reset-password__come-back"]').first();

        // profile
        this.loginUserProfileIcon = page.locator('[data-user-profile-menu-avatar], [class*="__user-profile-menu__avatar"]');
        this.loginUserProfileSignOut = page.locator('[data-user-profile-menu__sign_out]');

        // tabs
        this.loginModalAuthTabs = this.loginModal.locator('[class*="_auth__tabs"]');
        this.loginModalAuthTabLogin = this.loginModalAuthTabs.locator('[class*="_auth__tab"]').first();
        this.loginModalAuthTabSignup = this.loginModalAuthTabs.locator('[class*="_auth__tab"]').nth(1);
    }
    async openUserProfileMenu(isMobile) {
        if (isMobile && !(await this.loginUserProfileIcon.isVisible())) {
            await this._openMobileMenuIfNeeded(isMobile);
        }
        await expect(this.loginUserProfileIcon).toBeVisible();
        await this.loginUserProfileIcon.click();
    }

    async _openMobileMenuIfNeeded(isMobile) {
        if (!isMobile) return;
        await expect(this.headerMenuIcon).toBeVisible();
        await this.headerMenuIcon.click();
        await expect(this.loginButton).toBeVisible();
    }

    async _clickLoginButton() {
        await test.step("Click to Login button with retry and reload", async () => {
            let attempt = 0;

            await expect(async () => {
                attempt++;
                if (attempt > 2) {
                    await this.page.reload({ waitUntil: 'domcontentloaded' });
                }
                // модалка могла відкритись уже після попередньої перевірки: тоді вона перекриває кнопку і клік не пройде
                if (!(await this.loginModal.isVisible())) {
                    await this.loginButton.click({ timeout: 3000 });
                }
                await expect(this.loginModal).toBeVisible({ timeout: 3000 });
            }).toPass({
                intervals: [500, 1000, 2000],
                timeout: 20000
            });
        });
    }

    async _fillUserData(email, password) {
        await test.step("Fill user data and click login", async () => {
            await expect(this.loginEmailField).toBeVisible();

            await this.loginEmailField.fill(email);
            await this.loginPasswordField.fill(password);
            await this.loginSubmitButton.click();
            // вхід іде через бекенд: у замірах до 4,3 с, запасу до стандартних 5 с замало
            await expect(this.loginModal).toBeHidden({ timeout: 10000 });
        });
    }

    async userLoginOpenModal() {
        await this._clickLoginButton();
    }

    async userLoginOpenModalInt(isMobile) {
        await this._openMobileMenuIfNeeded(isMobile);
        await this._clickLoginButton();
    }

    async checkTabIsActive(tabLocator) {
        await expect(tabLocator).toHaveClass(/--active/);
    }

    async checkTabIsDisabled(tabLocator) {
        await expect(tabLocator).toHaveAttribute("disabled", "");
    }

    async userLogin(email, password, isMobile) {
        await this._clickLoginButton();
        await this._fillUserData(email, password);
    }

    async userLoginInt(email, password, isMobile) {
        await this._openMobileMenuIfNeeded(isMobile);
        await this._clickLoginButton();
        await this._fillUserData(email, password);
    }

    async fillUserData(email, password) {
        await this._fillUserData(email, password);
    }

    async userLoginValidate() {
        await test.step("Validate user is logged in", async () => {
            await expect(this.loginUserProfileIcon).toBeVisible();
        });
    }

    async userLogout() {
        await test.step("Click to profile icon and logout", async () => {
            await this.loginUserProfileIcon.click();
            await this.loginUserProfileSignOut.click();
            await expect(this.loginButton).toBeVisible();
        });
    }

    async closeLoginModal() {
        await test.step("Close login modal", async () => {
            await this.loginModalCloseButton.click();
            await expect(this.loginModal).toBeHidden();
        });
    }
}

