import { expect } from "@playwright/test";
import { ModalsComponent } from "./modalsComponent";
import { MainPage } from "../main.page";

export class WidgetsComponent extends MainPage {
    constructor(page) {
        super(page);
        this.modalComponent = new ModalsComponent(page);

        // Club widget
        this.clubsWidget = this.page.locator('[class*="_clubs-widget__wrapper"]');
        this.clubsWidgetTitle = this.clubsWidget.locator('[class*="_clubs-widget__title"]');
        this.clubsWidgetContainer = this.clubsWidget.locator('[class*="_clubs-widget__container"]');
        this.clubsWidgetOnbordingButton = this.clubsWidget.locator('button[class*="_clubs-widget__onboarding-btn"]');

        // Personal widget
        this.personalFeedWidget = this.page.locator('[class*="_personal-feed-widget"]');
        this.personalFeedWidgetHeader = this.personalFeedWidget.locator('[class*="_personal-feed-widget__header"]');
        this.personalFeedWidgetTitle = this.personalFeedWidgetHeader.locator('[class*="_personal-feed-widget__header-title-block"]');
        this.personalFeedWidgetEditButton = this.personalFeedWidgetHeader.locator('button[class*="_personal-feed-widget__edit-btn"]');
        this.personalFeedWidgetContent = this.personalFeedWidget.locator('[class*="_personal-feed-widget__content"]');
        this.personalFeedWidgetLink = this.personalFeedWidgetContent.locator('button[class*="_personal-feed-widget__link"]');

        // Best Comments widget
        this.bestCommentsWidget = this.page.locator('[class*="_best-comments"]').first();
        this.bestCommentsWidgetHeader = this.bestCommentsWidget.locator('[class*="_best-comments__header"]');
        this.bestCommentsWidgetTitle = this.bestCommentsWidgetHeader.locator('h2[class*="_best-comments__title"]');

        this.bestCommentsWidgetTabs = this.bestCommentsWidgetHeader.locator('[class*="_best-comments__tabs"]');
        this.bestCommentsTabDay = this.bestCommentsWidgetTabs.locator('.swiper-slide').nth(0);
        this.bestCommentsTabWeek = this.bestCommentsWidgetTabs.locator('.swiper-slide').nth(1);
        this.bestCommentsTabDayTitle = this.bestCommentsTabDay.locator('[class*="_tabs__tab-title_"]');
        this.bestCommentsTabWeekTitle = this.bestCommentsTabWeek.locator('[class*="_tabs__tab-title_"]');

        this.bestCommentsWidgetCommentsList = this.bestCommentsWidget.locator('[class*="_comments-list"]').first();
        this.bestCommentsWidgetCommentItems = this.bestCommentsWidgetCommentsList.locator('[class*="_comment-item"]').first();
        this.bestCommentsWidgetItemContentWrapper = this.bestCommentsWidgetCommentItems.locator('[class*="_comment-item__content-wrapper"]');
        this.bestCommentsWidgetItemContent = this.bestCommentsWidgetItemContentWrapper.locator('[class*="_comment-item__content_"]');
        this.bestCommentsWidgetItemContentText = this.bestCommentsWidgetCommentItems.locator('[class*="__text"], [class*="_text_"]').first();
        this.bestCommentsWidgetItemContentLink = this.bestCommentsWidgetCommentItems.locator('a, [class*="--link"]').first();

        this.bestCommentsWidgetFooter = this.bestCommentsWidgetCommentItems.locator('[class*="__footer"]');
        this.bestCommentsWidgetAuthorLink = this.bestCommentsWidgetFooter.locator('a[class*="_comment-item__author"]').first();
        this.bestCommentsWidgetLikesCount = this.bestCommentsWidgetFooter.locator('[class*="_likes_"]').first();

        // Top Users widget
        this.topUserWidget = this.page.locator('[class*="_top-user"]').first();
        this.topUserWidgetTitle = this.topUserWidget.locator('h2[class*="_top-user__title"]');

        this.topUserSwiperSlides = this.topUserWidget.locator('.swiper-slide');
        this.topUserFirstSlide = this.topUserSwiperSlides.nth(0);

        this.topUserNavNext = this.topUserWidget.locator('[class*="_navigation__nav-button--next"]');
        this.topUserNavPrev = this.topUserWidget.locator('[class*="_navigation__nav-button--prev"]');

        this.topUserSlideTitle = this.topUserWidget.locator('[class*="_top-user__item-title"]');

        this.topUserFirstItem = this.topUserFirstSlide.locator('a[class*="_metric-item"]').first();
        this.topUserFirstItemAvatar = this.topUserFirstItem.locator('[class*="_metric-item__logotypes"]');
        this.topUserFirstItemName = this.topUserFirstItem.locator('[class*="_metric-item__name"]');
        this.topUserFirstItemValue = this.topUserFirstItem.locator('[class*="_metric-item__value"]');

        // Top treads widget
        this.bestThreadsWidget = this.page.locator('[class*="_best-threads"]').first();
        this.bestThreadsWidgetTitle = this.bestThreadsWidget.locator('h2');

        this.bestThreadsWidgetList = this.bestThreadsWidget.locator('.swiper-wrapper');
        this.bestThreadsWidgetItem = this.bestThreadsWidgetList.locator('[class*="_thread-item"]').first();

        this.bestThreadsWidgetItemContentText = this.bestThreadsWidgetItem.locator('[class*="_text--subtitle-5"]').first();
        this.bestThreadsWidgetItemContentImage = this.bestThreadsWidgetItem.locator('img[class*="_image"]').first();

        this.bestThreadsWidgetItemFooter = this.bestThreadsWidgetItem.locator('[class*="_footer"]');
        this.bestThreadsWidgetItemAuthor = this.bestThreadsWidgetItemFooter.locator('a[class*="_thread-item__author"]').first();

        this.bestThreadsWidgetItemActions = this.bestThreadsWidgetItemFooter.locator('[class*="_actions"]');
        this.bestThreadsWidgetItemLikesButton = this.bestThreadsWidgetItemActions.locator('[class*="_likes"]');
        this.bestThreadsWidgetItemCommentsIcon = this.bestThreadsWidgetItemActions.locator('[class*="_comments"]');

    }

    async clickOnbordingButton() {
        await this.clubsWidgetOnbordingButton.click();
    }

    async scrollToBestCommentsWidget() {
        await this.bestCommentsWidget.scrollIntoViewIfNeeded();
    }

    async checkBestCommentsWidgetUI() {
        await this.checkElementIsVisible(this.bestCommentsWidget);
        await this.checkElementIsVisible(this.bestCommentsWidgetTitle);

        if (await this.bestCommentsWidgetTabs.isVisible()) {
            await this.checkElementIsVisible(this.bestCommentsWidgetTabs);
        }

        await this.checkElementIsVisible(this.bestCommentsWidgetCommentsList);
        await this.checkElementIsVisible(this.bestCommentsWidgetCommentItems);
        await this.checkElementIsClickable(this.bestCommentsWidgetItemContentLink);
        await this.checkElementIsVisible(this.bestCommentsWidgetItemContentText);
        await this.checkElementIsClickable(this.bestCommentsWidgetAuthorLink);
        await this.checkElementIsVisible(this.bestCommentsWidgetLikesCount);
    }

    async switchBestCommentsToWeek() {
        await this.bestCommentsTabWeek.click();
    }

    async switchBestCommentsToDay() {
        await this.bestCommentsTabDay.click();
    }

    async checkTabWeekIsActive() {
        await expect(this.bestCommentsTabWeekTitle).toHaveClass(/--active/);
        await expect(this.bestCommentsTabDayTitle).not.toHaveClass(/--active/);
    }

    async checkTabDayIsActive() {
        await expect(this.bestCommentsTabDayTitle).toHaveClass(/--active/);
        await expect(this.bestCommentsTabWeekTitle).not.toHaveClass(/--active/);
    }

    // --- TOP USERS WIDGET METHODS ---

    async scrollToTopUserWidget() {
        await this.topUserWidget.scrollIntoViewIfNeeded();
    }

    async checkTopUserWidgetUI() {
        await this.checkElementIsVisible(this.topUserWidget);
        await this.checkElementIsVisible(this.topUserWidgetTitle);

        await this.checkElementIsVisible(this.topUserFirstSlide);
        await this.checkElementIsVisible(this.topUserSlideTitle.first());

        await this.checkElementIsVisible(this.topUserFirstItem);
        await this.checkElementIsClickable(this.topUserFirstItem);
        await this.checkElementIsClickable(this.topUserFirstItemAvatar);
        await this.checkElementIsClickable(this.topUserFirstItemName);
        await this.checkElementIsClickable(this.topUserFirstItemValue);
    }

    // --- BEST THREADS WIDGET METHODS ---
    async scrollToBestThreadsWidget() {
        await this.bestThreadsWidget.scrollIntoViewIfNeeded();
    }

    async checkBestThreadsWidgetUI() {
        await this.checkElementIsVisible(this.bestThreadsWidget);
        await this.checkElementIsVisible(this.bestThreadsWidgetTitle);

        await this.checkElementIsVisible(this.bestThreadsWidgetList);
        await this.checkElementIsClickable(this.bestThreadsWidgetItem);

        if (await this.bestThreadsWidgetItemContentText.isVisible()) {
            await this.checkElementIsClickable(this.bestThreadsWidgetItemContentText);
        }

        if (await this.bestThreadsWidgetItemContentImage.isVisible()) {
            await this.checkElementIsClickable(this.bestThreadsWidgetItemContentImage);
        }

        await this.checkElementIsClickable(this.bestThreadsWidgetItemAuthor);
        await this.checkElementIsClickable(this.bestThreadsWidgetItemLikesButton);
        await this.checkElementIsClickable(this.bestThreadsWidgetItemCommentsIcon);
    }
}