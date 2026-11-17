import { expect } from "@playwright/test";
import { MainPage } from "./main.page";

export class BlogPage extends MainPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.blogPageHeader = page.locator('[class*="_blog-page__header"]').first();

        this.blogPageHeaderContent = this.blogPageHeader.locator('[class*="blog-page__header-content"]');
        this.blogPageAvatar = this.blogPageHeaderContent.locator('[class*="_blog-avatar"]').first();

        this.blogPageHeaderContentInfo = this.blogPageHeaderContent.locator('[class*="_blog-page__header__blog-info"]').first();
        this.blogPageTitle = this.blogPageHeaderContentInfo.locator('h1');
        this.blogPageDescription = this.blogPageHeaderContentInfo.locator('span').first();
        this.blogPageFounderInfo = this.blogPageHeaderContentInfo.locator('[class*="_blog-page__founder-info"]').first();
        this.blogPageFounderInfoLink = this.blogPageFounderInfo.locator('a');

        this.blogPagePostsSection = page.locator('[class*="__blog-page__blogs-container"], [class*="__blog_page__blogs_container"]');

        this.blogPagePostItem = this.blogPagePostsSection.getByTestId('post-item').first();
        this.blogPagePostItemImage = this.blogPagePostItem.locator('img[class*="_blog-card__image"]');

        this.blogPagePostItemContent = this.blogPagePostItem.locator('[class*="_blog-card__content"]');
        this.blogPagePostItemTitle = this.blogPagePostItemContent.getByTestId('post-item-title');
        this.blogPagePostItemDescription = this.blogPagePostItemContent.getByTestId('post-item-description');
        this.blogPagePostItemPublishTime = this.blogPagePostItemContent.getByTestId('post-item-time');
        this.blogPagePostItemComment = this.blogPagePostItemContent.getByTestId('post-item-comments');

        this.blogCreateButton = page.locator('[data-user-profile-menu__create_blog]').first();
        this.blogCreateButtonInt = page.locator('span[class*="user-profile-menu__text"]:has-text("Écrire un blog")');
        this.blogCreateWrapper = page.locator('[class*="_create-blog__wrapper"]');

        this.blogCreateTopSection = this.blogCreateWrapper.locator('[class*="_create-blog__top-section_"]');
        this.blogCreateBannerInput = this.blogCreateTopSection.locator('button').first();
        this.blogCreateAvatarInput = this.blogCreateTopSection.locator('button[class*="_create-blog__upload-avatar_"]');
        this.blogCreateAvatarInputTitle = this.blogCreateTopSection.locator('h3');

        this.blogCreateMiddleSection = this.blogCreateWrapper.locator('[class*="_create-blog__middle-section_"]');
        this.blogCreateTitleInput = this.blogCreateMiddleSection.locator('div[class*="_create-blog__user-name-input_"] input');
        this.blogCreateDescriptionTextArea = this.blogCreateMiddleSection.locator('div[class*="_ui-textarea_"] textarea');

        this.blogCreateBottomSection = this.blogCreateWrapper.locator('[class*="_create-blog__bottom-section_"]');
        this.blogCreateSaveButton = this.blogCreateBottomSection.locator('button[class*="_create-blog__save-changes-button_"]');
    }
}