import { test, expect } from "@playwright/test";
import { ModalsComponent } from "./modalsComponent";

export class SubscriptionComponent {
    constructor(page) {
        this.page = page;
        this.modalComponent = new ModalsComponent(page);

        this.subscriptionButton = this.page.locator('button[class*="_subscription-button"]');
        this.activeSubscriptionButton = this.subscriptionButton.locator('svg[class*="_subscription-button--filled-icon"]');
        this.unactiveSubscriptionButton = this.subscriptionButton.locator('svg[class*="_subscription-button--empty-icon"]');

        this.tagThumbnailsList = this.page.getByTestId('tag-thumbnails-list').first();
        this.tagThumbnail = this.tagThumbnailsList.getByTestId('tag-thumbnail').first();
        this.tagThumbnailSubscribeButton = this.tagThumbnail.getByTestId('subscription-actions');
        this.tagThumbnailSubscribeButtonActive = this.tagThumbnailSubscribeButton.locator('svg[class*="_subscription-actions__icon--filled"]');
        this.tagThumbnailSubscribeButtonUnactive = this.tagThumbnailSubscribeButton.locator('svg[class*="_subscription-actions__icon--empty"]');
    }

    async checkSubscriptionButton() {
        await expect(this.subscriptionButton).toBeVisible();
        await expect(this.subscriptionButton).toBeVisible();
    }

    async checkActiveSubscriptionButton() {
        await expect(this.activeSubscriptionButton).toBeVisible();
    }

    async checkUnactiveSubscriptionButton() {
        await expect(this.unactiveSubscriptionButton).toBeVisible();
    }

    async clickSubscriptionButton() {
        await this.subscriptionButton.click();
    }

    async clickForUnsubscribeOnSubscriptionButton() {
        await this.modalComponent.clickUntilVisible(
            this.activeSubscriptionButton,
            this.unactiveSubscriptionButton.or(this.modalComponent.subscriptionActionModal).first()
        );
    }

    async clickForSubscribeOnSubscriptionButton() {
        await this.modalComponent.clickUntilVisible(
            this.unactiveSubscriptionButton,
            this.activeSubscriptionButton.or(this.modalComponent.subscriptionModal).first()
        );
    }

    async isSubscribed() {
        return this.waitForStableSubscriptionState(this.activeSubscriptionButton, this.unactiveSubscriptionButton);
    }

    // Button is rendered as "not subscribed" first and switches to the real state after hydration,
    // so wait until one of the icons is visible and the state stops changing
    async waitForStableSubscriptionState(activeIcon, unactiveIcon, stableMs = 1000, timeout = 5000) {
        try {
            await activeIcon.or(unactiveIcon).first().waitFor({ state: 'visible', timeout });
        } catch {
            throw new Error("Failed to determine subscription status");
        }

        let state = await activeIcon.isVisible();
        let stableSince = Date.now();
        const deadline = Date.now() + timeout;

        while (Date.now() - stableSince < stableMs && Date.now() < deadline) {
            await this.page.waitForTimeout(100);
            const current = await activeIcon.isVisible();
            if (current !== state) {
                state = current;
                stableSince = Date.now();
            }
        }

        return state;
    }

    async checkTagThumbnailSubscribeButton() {
        await expect(this.tagThumbnailSubscribeButton).toBeVisible();
        await expect(this.tagThumbnailSubscribeButton).toBeVisible();
    }

    async checkTagThumbnailSubscribeButtonActive() {
        await expect(this.tagThumbnailSubscribeButtonActive).toBeVisible();
    }

    async checkTagThumbnailSubscribeButtonUnactive() {
        await expect(this.tagThumbnailSubscribeButtonUnactive).toBeVisible();
    }

    async clickTagThumbnailSubscribeButton() {
        await this.tagThumbnailSubscribeButton.click();
    }

    async clickForUnsubscribeOnTagThumbnailSubscribeButton() {
        await this.modalComponent.clickUntilVisible(this.tagThumbnailSubscribeButtonActive, this.modalComponent.subscriptionActionModal);
        await this.modalComponent.confirmUnsubscribe();
        await expect(this.tagThumbnailSubscribeButtonUnactive).toBeVisible();
    }

    async clickForSubscribeOnTagThumbnailSubscribeButton() {
        await this.modalComponent.clickUntilVisible(this.tagThumbnailSubscribeButtonUnactive, this.tagThumbnailSubscribeButtonActive);
    }

    async isTagThumbnailSubscribed() {
        return this.waitForStableSubscriptionState(this.tagThumbnailSubscribeButtonActive, this.tagThumbnailSubscribeButtonUnactive);
    }
}