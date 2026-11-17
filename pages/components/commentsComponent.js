import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { MainPage } from "../main.page";

// Бекенд відхиляє повторний текст на тому самому об'єкті (ALREADY_EXISTS), а цифри в тексті
// сприймає як номер телефону (INVALID_ARGUMENT), тому унікальний суфікс лише з літер — без uuid і timestamp.
export const uniqueCommentText = (prefix) => `${prefix} ${faker.random.alpha({ count: 16 })}`;

const pagesWithAdHandler = new WeakSet();

export class CommentsComponent extends MainPage {
    constructor(page, container = page) {
        super(page);
        this.page = page;
        this.container = container;
        this.trackCommentsListRequests();
        this.closeFullScreenAdWhenShown();

        // Icons in header
        this.actionsGroup = page.locator('[class*="_about__actions-group"]').first();
        this.commentsCounterIcon = this.actionsGroup.locator('div[class*="_comments"]');
        this.bookmarksActionButton = this.actionsGroup.locator('div[class*="_bookmark-button"]');
        this.newsItemCommentsItem = this.mainNewsItem.first().getByTestId('news-item-comments');

        // Comment container
        this.commentContainer = this.container.locator('[class*="_comments__container"]').first();
        this.commentEmptyBlock = this.container.locator('[class*="_comments-modal__empty-comments-block"]').first();
        this.commentList = this.container.locator('[class*="_comments__list"], [class*="_comment-list"]');
        this.commentThread = this.commentContainer.locator('[class*="_thread"]').first();

        // Comment creation form
        this.commentFormWrapper = this.container.locator('[class*="_comments__main-input"], [class*="_comment-form__wrapper"]').first();
        this.commentFormUser = this.commentFormWrapper.locator('[class*="_comment-form__user"]');
        this.commentFormInputWrapper = this.commentFormWrapper.locator('[class*="_comment-form__textarea"], [class*="_ui-textarea"]').first();
        this.commentFormSendMessageButton = this.commentFormWrapper.locator('[class*="_comment-form__send-message"]').first();

        // Published comment elements
        this.commentItems = this.commentContainer.locator('[class*="_comment-item__content"], [class*="_comment-item"]');
        this.publishedCommentItem = this.commentThread.locator('[class*="_comment-item__content"], [class*="_comment-item"]').first();
        this.commentItemControls = this.publishedCommentItem.locator('[class*="_comment-item__controls"]');
        this.commentItemReplyButton = this.commentItemControls.locator('span[class*="_comment-item__reply-button"]');

        // Reply form
        this.commentItemReplyForm = this.commentThread.locator('[class*="_comment-form"]').first();
        this.commentItemReplyBlock = this.commentItemReplyForm.locator('[class*="_comment-form__textarea"]');
        this.commentItemReplyInput = this.commentItemReplyBlock.locator('textarea[class*="_ui-textarea__textarea"]');
        this.commentItemReplySendButton = this.commentItemReplyForm.locator('[data-send-comment-btn]');

        // Phantom menu
        this.commentPhantomMenuButton = this.commentFormWrapper.locator('button[class*="_comment-form__fantom-menu-button"], [class*="_comment-form__fantom-menu-block"]').first();
        this.commentPhantomMenu = this.commentFormWrapper.locator('div[class*="_fantom-user-menu"]');

        // Dropdowns (club/app and user)
        this.commentPhantomAppDropdownTrigger = this.commentPhantomMenu.locator('[class*="_dropdown__selected-item"]').first();
        this.commentPhantomSelectUser = this.commentPhantomMenu.locator('[class*="_dropdown__selected-item"]').last();

        // Active dropdown menu and its items
        this.activeDropdownMenu = this.page.locator('div[class*="_dropdown__menu"][class*="_dropdown__menu--active"]');
        this.activeDropdownItems = this.activeDropdownMenu.locator('div[class*="_dropdown-item"]');
        this.commentPhantomUserInput = this.activeDropdownMenu.locator('input[name="fantomUser"]');
    }

    get inputField() {
        return this.commentFormWrapper.locator('textarea, [contenteditable="true"], input:not([type="hidden"])').first();
    }

    // Посилання на новину зі стрічки головної, у якої є (або немає) коментарів; порожній лічильник = 0 коментарів
    async findNewsLinkByComments(hasComments) {
        // лише читаємо DOM: на мобільному стрічку може перекривати повноекранна реклама
        await expect(this.mainNewsItem.first()).toBeAttached();
        const items = await this.mainNewsItem.evaluateAll(els => els.map(el => ({
            count: Number(el.querySelector('[data-test="news-item-comments"]')?.textContent.trim() || 0),
            href: (el.closest('a[href]') || el.querySelector('a[href]'))?.getAttribute('href'),
        })));
        return items.find(item => item.href && (item.count > 0) === hasComments)?.href;
    }

    // Якщо піти зі сторінки, поки currentUser у дорозі, наступний запит іноді отримує CANCELED,
    // і клієнт показує незалогінений стан: форма коментаря відкриває модалку входу
    async gotoWithActiveSession(url) {
        await expect(async () => {
            const [response] = await Promise.all([
                this.page.waitForResponse(
                    (res) => res.request().postData()?.includes('"operationName":"currentUser"'),
                    { timeout: 30000 }
                ),
                this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }),
            ]);
            const { data } = await response.json();
            expect(data?.userQueries?.current, 'currentUser should return the logged-in user').toBeTruthy();
        }).toPass({ timeout: 70000 });
    }

    async openCommentsModal() {
        await expect(this.commentsCounterIcon).toBeVisible();
        await this.commentsCounterIcon.click();
        await expect(this.inputField).toBeVisible();
    }

    getCommentByText(text) {
        return this.commentItems.filter({ has: this.page.getByText(text, { exact: false }) }).first();
    }

    getSuperTagOf(commentLocator) {
        return commentLocator.locator('[class*="_comment-super-tag_"]').first();
    }

    getSuperTagLabelOf(superTagLocator) {
        return superTagLocator.locator('[class*="_comment-super-tag-label__text"]').first();
    }

    async openCommentsFromMainNews() {
        await expect(this.newsItemCommentsItem).toBeVisible();
        await this.newsItemCommentsItem.click();

        await expect(this.commentFormWrapper).toBeVisible();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async checkCommentFormUI() {
        await expect(this.commentFormWrapper).toBeVisible();
        await expect(this.commentFormUser).toBeVisible();
        await expect(this.inputField).toBeVisible();
        await expect(this.commentFormSendMessageButton).toBeVisible();
    }

    async checkCommentsListUI() {
        await expect(this.commentContainer.or(this.commentEmptyBlock).first()).toBeVisible();
    }

    // Мобільна повноекранна реклама з'являється у випадковий момент і перекриває кліки
    closeFullScreenAdWhenShown() {
        if (pagesWithAdHandler.has(this.page)) return;
        pagesWithAdHandler.add(this.page);
        this.page.addLocatorHandler(this.fullScreenCloseBtn, (closeButton) => closeButton.click(), { noWaitAfter: true });
    }

    trackCommentsListRequests() {
        this.commentsListRequestsInFlight = new Set();
        this.commentsListLastActivity = 0;
        this.commentsListLoaded = false;

        const isCommentsList = (request) => request.postData()?.includes('"operationName":"getComments"');
        const onFinished = (request) => {
            if (!this.commentsListRequestsInFlight.delete(request)) return;
            this.commentsListLastActivity = Date.now();
            this.commentsListLoaded = true;
        };

        this.page.on('request', (request) => {
            // Для запитів, обірваних переходом або reload, подія завершення може не прийти. Скидаємо стан лише на новий
            // документ: framenavigated спрацьовує і на переходах у межах документа, а тоді скидає вже завантажений список
            if (request.isNavigationRequest() && request.frame() === this.page.mainFrame()) {
                this.commentsListRequestsInFlight.clear();
                this.commentsListLoaded = false;
                return;
            }
            if (!isCommentsList(request)) return;
            this.commentsListRequestsInFlight.add(request);
            this.commentsListLastActivity = Date.now();
        });
        this.page.on('requestfinished', onFinished);
        this.page.on('requestfailed', onFinished);
    }

    // Після монтування форми список перезапитується; відповідь, що прийшла після CreateComment, прибирає новий коментар зі списку
    async waitForCommentsListSettled(quietMs = 1500) {
        await expect.poll(
            () => this.commentsListRequestsInFlight.size === 0 && Date.now() - this.commentsListLastActivity >= quietMs,
            { message: 'Comments list keeps reloading', timeout: 20000, intervals: [100] }
        ).toBe(true);
    }

    // Сервер віддає кнопку без класу --inactive, а змонтована клієнтська форма з порожнім полем його має.
    // Текст, введений раніше, втрачається, бо після кліку клієнтська форма замінює серверну
    async fillCommentForm(input, sendButton, text) {
        await input.click({ timeout: 10000 });
        await expect(sendButton).toHaveClass(/--inactive/, { timeout: 10000 });
        await input.fill(text);
        await expect(sendButton).not.toHaveClass(/--inactive/);
    }

    // Чекаємо саме відповідь CreateComment, щоб відмову бекенду було видно в тексті помилки
    async submitComment(sendButton) {
        const [response] = await Promise.all([
            this.page.waitForResponse(
                (res) => res.request().postData()?.includes('"operationName":"CreateComment"'),
                { timeout: 30000 }
            ),
            sendButton.click({ timeout: 10000 }),
        ]);
        const { errors } = await response.json();
        expect(errors, 'CreateComment should succeed').toBeUndefined();
    }

    async sendComment(text) {
        await this.fillCommentForm(this.inputField, this.commentFormSendMessageButton, text);
        await this.waitForCommentsListSettled();
        await expect(this.inputField).toHaveValue(text);
        await this.submitComment(this.commentFormSendMessageButton);
    }

    async replyToComment(replyText) {
        await this.commentItemReplyButton.first().click({ timeout: 10000 });
        await this.fillCommentForm(this.commentItemReplyInput, this.commentItemReplySendButton, replyText);
        await this.submitComment(this.commentItemReplySendButton);
    }

    async checkCommentPublished(text) {
        const publishedComment = this.commentContainer.getByText(text, { exact: false }).first();
        await expect(publishedComment).toBeVisible();
        await publishedComment.scrollIntoViewIfNeeded();
    }

    // Якщо клікнути поле, поки йдуть початкові запити сторінки, кнопка з'явиться, але меню не відкриється
    // навіть після повторних кліків. Перший getComments стартує пізніше за currentUser, тому чекаємо саме його відповідь.
    // Після кліку форма монтується знову й перезапитує список, тому тишу рахуємо від кліку.
    // Кнопка працює як перемикач, тому клікаємо повторно лише за закритого меню
    async openPhantomMenu() {
        await expect.poll(() => this.commentsListLoaded, { message: 'Comments list should load', timeout: 30000, intervals: [100] }).toBe(true);
        await this.waitForCommentsListSettled();
        await this.inputField.click({ timeout: 15000 });
        this.commentsListLastActivity = Date.now();
        await expect(this.commentPhantomMenuButton).toBeVisible({ timeout: 15000 });
        await this.waitForCommentsListSettled();

        await expect(async () => {
            if (!await this.commentPhantomMenu.isVisible()) {
                await this.commentPhantomMenuButton.click({ timeout: 5000 });
            }
            await expect(this.commentPhantomMenu).toBeVisible({ timeout: 4000 });
        }).toPass({ timeout: 20000 });
    }

    async openPhantomDropdown(trigger) {
        if (!await this.activeDropdownMenu.isVisible()) {
            await trigger.click({ timeout: 5000 });
        }
        await expect(this.activeDropdownMenu).toBeVisible({ timeout: 4000 });
    }

    // Закриття мобільної реклами згортає відкритий список, тому повторюємо вибір цілком
    async selectPhantomUserByLink(profileUrl, expectedAuthorName) {
        await expect(async () => {
            await this.openPhantomDropdown(this.commentPhantomSelectUser);

            await this.commentPhantomUserInput.fill(profileUrl, { timeout: 5000 });
            await this.commentPhantomUserInput.press('Enter', { timeout: 5000 });

            const userOption = this.activeDropdownItems.filter({ hasText: expectedAuthorName }).first();
            await userOption.click({ timeout: 10000 });

            await expect(this.commentPhantomSelectUser).toContainText(expectedAuthorName);
        }).toPass({ timeout: 45000 });
    }

    async checkCommentPublishedByAuthor(authorName, text) {
        const commentRow = this.getCommentByText(text);

        await expect(commentRow).toBeVisible();
        await commentRow.scrollIntoViewIfNeeded();
        await expect(commentRow).toContainText(authorName);
    }

    async selectPhantomApp(appName) {
        await expect(async () => {
            await this.openPhantomDropdown(this.commentPhantomAppDropdownTrigger);

            const appItem = this.activeDropdownItems.filter({ hasText: appName }).first();
            await appItem.click({ timeout: 5000 });

            await expect(this.commentPhantomAppDropdownTrigger).toContainText(appName);
        }).toPass({ timeout: 30000 });
    }

    async checkCommentHasSuperTag(commentText, expectedTagLabel) {
        const commentItem = this.getCommentByText(commentText);

        await expect(commentItem).toBeVisible();
        await commentItem.scrollIntoViewIfNeeded();

        const superTag = this.getSuperTagOf(commentItem);
        await expect(superTag).toBeVisible();

        const tagLabel = this.getSuperTagLabelOf(superTag);
        await expect(tagLabel).toHaveText(expectedTagLabel);
    }
}