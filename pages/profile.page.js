import { MainPage } from "./main.page";
import { socialInputsText } from "../src/constants";

export class ProfilePage extends MainPage {
    constructor(page) {
        super(page);
        this.page = page;

        this.userProfileLink = this.page.locator('a[class*="user_profile_menu__text"], a[class*="user-profile-menu__text"]');
        this.userProfileHeader = this.page.locator('[class*="_user-header__content"]');
        this.userUpdateProfileButton = this.userProfileHeader.locator('[class*="_user-header__edit-button_"]');

        this.userUpdateProfileForm = this.page.locator('form[class*="_edit-user-profile"]');
        this.userUpdateProfileFormTopSection = this.userUpdateProfileForm.locator('[class*="_edit-user-profile__top-section"]');
        this.userUpdateProfileFormAvatar = this.userUpdateProfileFormTopSection.locator('[class*="_edit-user-profile__avatar-wrapper"]');
        this.userUpdateProfileFormAvatarButtons = this.userUpdateProfileFormTopSection.locator('[class*="_edit-user-profile__buttons_"]');
        this.uploadAvatarButton = this.userUpdateProfileFormAvatarButtons.locator('button').first();

        this.userUpdateProfileFormMiddleSection = this.userUpdateProfileForm.locator('[class*="_edit-user-profile__middle-section"]');
        this.userUpdateProfileFormMainInfo = this.userUpdateProfileFormMiddleSection.locator('[class*="_edit-user-profile__left-block"]');
        this.userUpdateProfileFormMainInfoTitle = this.userUpdateProfileFormMainInfo.locator('h2');

        this.userUpdateProfileFormSocialNetworks = this.userUpdateProfileFormMiddleSection.locator('[class*="_edit-user-profile__right-block"]');
        this.userUpdateProfileFormSocialNetworksTitle = this.userUpdateProfileFormSocialNetworks.locator('h2');

        this.profileBookmarksHeader = this.page.locator('[class*="ProfileBookmarksPage-module"][class*="__bookmarks__header"]');

        this.userUpdateProfileSaveChangesButton = this.userUpdateProfileForm.locator('button[class*="_edit-user-profile__save-changes-button"]');

        this.socialInputs = {};
        Object.values(socialInputsText).forEach((labelText) => {
            this.socialInputs[labelText] = this.userUpdateProfileFormSocialNetworks.locator(
                `label:has-text("${labelText}") input`
            );
        });

    }
};