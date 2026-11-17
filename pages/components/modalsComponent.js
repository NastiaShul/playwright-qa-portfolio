import { expect } from "@playwright/test";
import { CommentsComponent } from "./commentsComponent";

export class ModalsComponent {
    constructor(page) {
        this.page = page;

        // Unsubscribe action modal
        this.subscriptionActionModal = this.page.locator('[class*="_subscription-actions__delete-modal"]');
        this.confirmUnsubscribeButton = this.subscriptionActionModal.locator('[data-modal-first-button="true"]');
        this.cancelUnsubscribeButton = this.subscriptionActionModal.locator('[data-modal-seccond-button="true"]');

        // Onboarding modal
        this.onbordingModal = this.page.locator('[class*="_subscription-onboarding__wrapper"]');

        this.onbordingModalHeader = this.onbordingModal.locator('[class*="_subscription-onboarding__header"]');
        this.onbordingModalHeaderTop = this.onbordingModalHeader.locator('[class*="_subscription-onboarding__top"]');
        this.onbordingModalProgressBar = this.onbordingModalHeaderTop.locator('[class*="_subscription-onboarding__progress"]');
        this.onbordingModalCloseButton = this.onbordingModalHeaderTop.locator('[class*="_subscription-onboarding__top-close"]');

        this.onbordingModalTitles = this.onbordingModalHeader.locator('[class*="_subscription-onboarding__titles"]');

        this.onbordingModalMain = this.onbordingModal.locator('[class*="_subscription-onboarding__main"]');
        this.onbordingModalSearch = this.onbordingModalMain.locator('[class*="input--search"]');

        this.onbordingModalContentList = this.onbordingModalMain.locator('[class*="_subscription-onboarding__content-list"]');
        this.onbordingModalContentListCard = this.onbordingModalContentList.locator('[class*="_onboarding-card"]');
        this.onbordingModalContentListCardAvatar = this.onbordingModalContentListCard.locator('[class*="_onboarding-card__avatar"]');
        this.onbordingModalContentListCardTitle = this.onbordingModalContentListCard.locator('[class*="_onboarding-card__title"]');

        this.onbordingModalChosenList = this.onbordingModalMain.locator('[class*="_chosen-card-list__wrapper"]');
        this.onbordingModalChosenListTitle = this.onbordingModalChosenList.locator('[class*="_chosen-card-list__title"]');
        this.onbordingModalContentListItems = this.onbordingModalChosenList.locator('ul[class*="_chosen-card-list"]');

        this.onbordingModalActionButton = this.onbordingModalMain.locator('[class*="_subscription-onboarding__action-buttons"]');
        this.onbordingModalActionButtonBack = this.onbordingModalActionButton.locator('[class*="_subscription-onboarding__action-buttons--back"]');
        this.onbordingModalActionButtonNext = this.onbordingModalActionButton.locator('[class*="_subscription-onboarding__action-buttons--next"]');

        // user subscription modal
        this.subscriptionModal = this.page.locator('[class*="user-subscriptions-modal_"]').first();
        this.subscriptionModalCloseButton = this.subscriptionModal.locator('[class*="_onboarding-modal__header-close-btn"]');

        this.subscriptionModalContent = this.subscriptionModal.locator('[class*="_onboarding-modal__content"]');

        this.subscriptionModalButtonBlock = this.subscriptionModal.locator('[class*="_onboarding-modal__bottom-block"]');
        this.subscriptionModalButtonOpenPersonalPage = this.subscriptionModalButtonBlock.locator('button:nth-of-type(1)');
        this.subscriptionModalButtonSubsrcriptionSettings = this.subscriptionModalButtonBlock.locator('button:nth-of-type(2)');

        // create thread modal
        this.newThreadButtonUserMenu = this.page.locator('[data-user-profile-menu__create_thread="true"]');
        this.newThreadButton = this.page.locator('button[class*="_new-thread-overlay"]');
        this.newThreadModal = this.page.locator('[class*="_create-thread-modal"]').first();

        this.newThreadModalCloseButton = this.newThreadModal.locator('[class*="_create-thread-modal__close-btn"]');

        this.newThreadModalAuthorBlock = this.newThreadModal.locator('[class*="_create-thread-form__author-block"]');
        this.newThreadModalAuthorAvatar = this.newThreadModalAuthorBlock.locator('[class*="_create-thread-form__avatar"]');
        this.newThreadModalAuthorDetails = this.newThreadModalAuthorBlock.locator('[class*="_create-thread-form__author-details"]');
        this.newThreadModalAuthorName = this.newThreadModalAuthorDetails.locator('[class*="_create-thread-form__author-name"]');
        this.newThreadModalAuthorBlogsInfo = this.newThreadModalAuthorDetails.locator('[class*="_create-thread-form__blogs-info"]');


        this.newThreadModalFormEditor = this.newThreadModal.locator('[class*="_create-thread-form__editor"]').first();
        this.newThreadModalFormActions = this.newThreadModal.locator('[class*="_create-thread-form__actions"]');
        this.newThreadModalFormAddImageButton = this.newThreadModalFormActions.locator('button[class*="_create-thread-form__image-btn"]');
        this.newThreadModalFormAddTagsInput = this.newThreadModalFormActions.locator('[class*="_create-thread-form__tags-input"]');
        this.tagsInput = this.newThreadModalFormAddTagsInput.locator('[id="search-input"]');

        this.createThreadButton = (text) => this.newThreadModal.getByRole('button', { name: text });

        this.successToast = this.page.locator('[class*="_create-thread-modal__toast"]').first();

        // create thread comment modal
        this.threadCommentModal = this.page.locator('[class*="_modal__content"]');
        this.threadCommentModalHeader = this.threadCommentModal.locator('[class*="_comments-modal__header"]').first();
        this.threadCommentModalCloseButton = this.threadCommentModalHeader.locator('[class*="_comments-modal__header-close-btn"]');
        this.threadCommentModalTitle = this.threadCommentModalHeader.locator('[class*="_comments-modal__header-title"]');

        // Вбудовуємо CommentsComponent безпосередньо в модалку!
        this.comments = new CommentsComponent(this.page, this.threadCommentModal);


    }

    // До гідрації кнопка вже видима, але без обробника: клік проходить і нічого не відбувається,
    // і скільки б ми не чекали, результат не з'явиться. Тому не чекаємо довше, а клікаємо повторно.
    // trigger має зникати після успіху (іконка конкретного стану), тому зайвий клік не перемкне стан назад
    async clickUntilVisible(trigger, expected) {
        await expect(async () => {
            if (await expected.isVisible()) return;
            await trigger.click({ timeout: 2000 });
            await expect(expected).toBeVisible({ timeout: 2000 });
        }).toPass({ timeout: 10000 });
    }

    async confirmUnsubscribe() {
        await expect(this.subscriptionActionModal).toBeVisible();
        await expect(async () => {
            if (await this.confirmUnsubscribeButton.isVisible()) {
                await this.confirmUnsubscribeButton.click({ timeout: 2000 });
            }
            await expect(this.subscriptionActionModal).toBeHidden({ timeout: 2000 });
        }).toPass({ timeout: 10000 });
    }

    async cancelUnsubscribe() {
        await expect(this.subscriptionActionModal).toBeVisible();
        await expect(this.cancelUnsubscribeButton).toBeVisible();
        await this.cancelUnsubscribeButton.click();
        await expect(this.subscriptionActionModal).toBeHidden();
    }

    async waitForOnboardingVisible() {
        await expect(this.onbordingModal).toBeVisible();
    }

    async selectTagByName(name) {
        const card = this.onbordingModalContentListCard.filter({ hasText: name });
        await card.click();
    }

    async clickNext() {
        await this.onbordingModalActionButtonNext.click();
    }

    async closeOnboarding() {
        await this.onbordingModalCloseButton.click();
        await expect(this.onbordingModal).toBeHidden();
    }

    async getActiveStepNumber() {
        const steps = this.onbordingModalProgressBar.locator('div');
        return await steps.count();
    }

    async checkSubscriptionModalVisible() {
        await expect(this.subscriptionModal).toBeVisible();
    }

    async openPersonalPage() {
        await expect(this.subscriptionModalButtonOpenPersonalPage).toBeVisible();
        await this.subscriptionModalButtonOpenPersonalPage.click({ force: true });
    }

    async openSubscriptionSettings() {
        await expect(this.subscriptionModalButtonSubsrcriptionSettings).toBeVisible();
        await this.subscriptionModalButtonSubsrcriptionSettings.click({ force: true });
    }

    async closeSubscriptionModal() {
        await expect(this.subscriptionModalCloseButton).toBeVisible();
        await this.subscriptionModalCloseButton.click({ force: true });
        await expect(this.subscriptionModal).toBeHidden();
    }

    async openNewThreadModalFromUserMenu() {
        await expect(this.newThreadButtonUserMenu).toBeVisible();
        await this.clickUntilVisible(this.newThreadButtonUserMenu, this.newThreadModal);
    }

    async openNewThreadModalFromOverlay() {
        await expect(this.newThreadButton).toBeVisible();
        await this.clickUntilVisible(this.newThreadButton, this.newThreadModal);
    }

    async closeNewThreadModal() {
        await this.newThreadModalCloseButton.click();
        await expect(this.newThreadModal).toBeHidden();
    }

    async checkNewThreadModalUI(expectedButtonText) {
        await expect(this.newThreadModal).toBeVisible();

        await expect(this.newThreadModalAuthorAvatar).toBeVisible();
        // ім'я приходить із запитом currentUser: у замірах до 3,5 с, запасу до стандартних 5 с замало
        await expect(this.newThreadModalAuthorName).not.toBeEmpty({ timeout: 10000 });

        await expect(this.newThreadModalFormEditor).toBeVisible();
        await expect(this.tagsInput).toBeVisible();

        const submitBtn = this.createThreadButton(expectedButtonText);
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toBeDisabled();
    }

    async fillThreadContent(text) {
        await expect(this.newThreadModalFormEditor).toBeVisible();
        const editableArea = this.newThreadModalFormEditor.locator('[contenteditable="true"], textarea').first();
        await expect(editableArea).toBeVisible();
        await editableArea.click();
        await editableArea.pressSequentially(text, { delay: 50 });
    }

    async submitNewThread(buttonText) {
        const submitBtn = this.createThreadButton(buttonText);
        await expect(submitBtn).toBeEnabled();
        await submitBtn.click();

        await expect(this.successToast).toBeVisible();
    }

    async goToNewThread() {
        const goToButton = this.successToast.locator('button[class*="_btn--contained"]');
        await expect(goToButton).toBeVisible();
        await goToButton.click();
        await expect(this.successToast).toBeHidden();
    }

    // Thread comment modal

    async waitForThreadCommentModalVisible() {
        await expect(this.threadCommentModal).toBeVisible();
    }

    async checkThreadCommentModalUI() {
        await expect(this.threadCommentModalHeader).toBeVisible();
        await expect(this.threadCommentModalTitle).toBeVisible();
        await expect(this.threadCommentModalCloseButton).toBeVisible();

        // Викликаємо перевірки з CommentsComponent!
        await this.comments.checkCommentFormUI();
        await this.comments.checkCommentsListUI();
    }

    async closeThreadCommentModal() {
        await this.threadCommentModalCloseButton.click();
        await expect(this.threadCommentModal).toBeHidden();
    }

}