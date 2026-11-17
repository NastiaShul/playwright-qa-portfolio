import { expect } from "@playwright/test";
import { MainPage } from "./main.page";
import { ModalsComponent } from "./components/modalsComponent";

export class ThreadPage extends MainPage {
    constructor(page) {
        super(page);
        this.page = page;
        this.modalsComponent = new ModalsComponent(page);

        // --- common locators ---
        this.threadsHubPageTitle = (text) => this.page.locator('h1').filter({ hasText: text });
        this.threadPageCommentsBlock = this.page.locator("[class*='_thread-card__comments']");

        // ==========================================
        // methods for thread hub page (/threads)
        // ==========================================
        this.threadCard = this.page.getByTestId("thread-item").first();

        this.threadCardHeaderBlock = this.threadCard.locator("[class*='_thread-card__header-block']");
        this.threadCardAuthorAvatar = this.threadCardHeaderBlock.locator("a[class*='_about__author-avatar']");
        this.threadCardAuthorUsername = this.threadCardHeaderBlock.locator("a[class*='_about__author-name']");
        this.threadCardAuthorRole = this.threadCardHeaderBlock.locator("a[class*='_about__role']");

        this.threadCardBlogAvatar = this.threadCard.locator("a[class*='_about__blog-avatar']");
        this.threadCardBlogName = this.threadCard.locator("a[class*='_about__blog-name']");
        this.threadCardBlogAuthor = this.threadCard.locator("a[class*='_about__blog-author']");

        this.threadCardChip = this.threadCardHeaderBlock.locator("[class*='_thread-card__chip']");

        this.threadCardContentBlock = this.threadCard.locator("[class*='_thread-card__content-block']");
        this.threadCardTime = this.threadCardContentBlock.locator("[data-test='thread-item-time']");
        this.threadCardContentText = this.threadCardContentBlock.locator("[class*='_thread-card__content-text']").first();
        this.threadCardImages = this.threadCard.locator("[data-test='item-images']");

        this.threadCardBottomPanel = this.threadCard.locator("[class*='_blog-card__bottom-panel']");
        this.threadCardComments = this.threadCardBottomPanel.locator("[data-test='thread-item-comments']");
        this.threadCardItemPlus = this.threadCardBottomPanel.locator("[data-test='thread-item-plus']");
        this.threadCardAddBookmarkButton = this.threadCardBottomPanel.locator("[class*='_bookmark-button']").first();
        this.threadCardModeratorButton = this.threadCardBottomPanel.locator("[class*='_moderator-btn']");

        // ==========================================
        // methods for thread page (/threads/:id)
        // ==========================================
        this.threadPageContainer = this.page.locator("main, article, [class*='_thread-page']").first();

        this.threadPageAbout = this.threadPageContainer.locator("[class*='_about']");
        this.threadPageAuthorAvatar = this.threadPageAbout.locator("a[class*='_thread-card__about-author-avatar']");
        this.threadPageAuthorAbout = this.threadPageAbout.locator("[class*='_thread-card__about-author-date']");
        this.threadPageAuthor = this.threadPageAbout.locator("a").first();
        this.threadPageDate = this.threadPageAbout.locator("[class*='_thread-card__about-date']");

        this.threadPageContent = this.threadPageContainer.locator("[class*='_thread-card__content']");
        this.threadPageImages = this.threadPageContent.locator("[data-test='item-images']");

        this.threadPageTags = this.threadPageContainer.locator("[data-test='tag-thumbnails-list']");

        this.threadPageFooter = this.threadPageContainer.locator("[class*='_thread-card__footer']").first();
        this.threadPageComments = this.threadPageFooter.locator("[class*='_comments']").first();
        this.threadPageItemPlus = this.threadPageFooter.locator("[class*='_reaction']").first();
        this.threadPageAddBookmarkButton = this.threadPageFooter.locator("[class*='_bookmark-button']").first();

    }

    async checkThreadsHubPageTitle(title) {
        await expect(this.threadsHubPageTitle(title)).toBeVisible();
    }

    // ==========================================
    // methods for thread hub page (/threads)
    // ==========================================
    async checkCommonCardElements() {
        await this.checkElementIsVisible(this.threadCard);
        await this.checkElementIsVisible(this.threadCardChip);
        await this.checkElementIsVisible(this.threadCardTime);
    }

    async isBlogThreadType() {
        const authorOrBlogIndicator = this.threadCardBlogName.or(this.threadCardAuthorUsername);
        await expect(authorOrBlogIndicator.first()).toBeVisible();
        return await this.threadCardBlogName.isVisible();
    }

    async checkBlogHeaderElements() {
        await this.checkElementIsClickable(this.threadCardBlogAvatar);
        await this.checkElementIsClickable(this.threadCardBlogName);
        await this.checkElementIsClickable(this.threadCardBlogAuthor);
    }

    async checkAuthorHeaderElements() {
        await this.checkElementIsClickable(this.threadCardAuthorAvatar);
        await this.checkElementIsClickable(this.threadCardAuthorUsername);
        await this.checkElementIsClickable(this.threadCardAuthorRole);
    }

    async checkThreadContentElements() {
        await this.checkElementIsVisible(this.threadCardContentBlock);

        if (await this.threadCardContentText.isVisible()) {
            await expect(this.threadCardContentText).not.toBeEmpty();
        }

        if (await this.threadCardImages.isVisible()) {
            await this.checkElementIsClickable(this.threadCardImages);
        }

        const hasText = await this.threadCardContentText.isVisible();
        const hasImage = await this.threadCardImages.isVisible();
        expect(hasText || hasImage, 'Thread must contain either text or an image').toBeTruthy();
    }

    async checkThreadBottomPanelElements() {
        await this.checkElementIsVisible(this.threadCardBottomPanel);
        await this.checkElementIsClickable(this.threadCardAddBookmarkButton);

        if (await this.threadCardComments.isVisible()) {
            await this.checkElementIsVisible(this.threadCardComments);
        }
        if (await this.threadCardItemPlus.isVisible()) {
            await this.checkElementIsVisible(this.threadCardItemPlus);
        }
    }

    // ==========================================
    // methods for thread page (/threads/:id)
    // ==========================================
    async checkOpenedThreadHeader() {
        await this.checkElementIsVisible(this.threadPageAuthorAvatar);
        await this.checkElementIsClickable(this.threadPageAuthor);
        await this.checkElementIsVisible(this.threadPageDate);
    }

    async checkOpenedThreadContent() {
        if (await this.threadPageContent.isVisible()) {
            await this.checkElementIsVisible(this.threadPageContent);
        }

        if (await this.threadPageTags.isVisible()) {
            await this.checkElementIsVisible(this.threadPageTags);
        }

        if (await this.threadPageImages.isVisible()) {
            await this.checkElementIsVisible(this.threadPageImages);
        }
    }

    async checkOpenedThreadFooter() {
        await this.checkElementIsVisible(this.threadPageFooter);
        await this.checkElementIsClickable(this.threadPageItemPlus);
        await this.checkElementIsClickable(this.threadPageAddBookmarkButton);
        await this.checkElementIsVisible(this.threadPageComments);
    }

}