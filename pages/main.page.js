import { expect } from "@playwright/test";

export class MainPage {
  constructor(page) {
    this.page = page;
    this.buttonAllTransfers = page.getByRole('link', { name: 'ALL TRANSFERS' });
    this.buttonAllTournaments = page.getByRole('link', { name: 'ALL TOURNAMENTS' });
    this.logoUa = page.getByTestId('main-page-logo');
    this.logo = page.locator('[class*="logo__logo"]');
    this.languagePickerUa = page.getByTestId('language-selector');
    this.loginButton = page.locator('[data-login-button], [class*="__login-button"]');
    this.loginButtonAlt = page.locator('[class*="header__login"]');
    this.headerLanguageSelector = page.locator('[class*="_dropdown--header"]');
    this.themeSelector = page.getByTestId('theme-selector').first();
    this.searchInput = page.getByTestId('search-input').first();

    this.teaserSection = page.getByTestId('main-page-teaser');


    this.newsSection = page.getByTestId("news-section");
    this.mainNewsItem = this.newsSection.getByTestId('main-news-item');
    this.mainBlogItem = page.getByTestId('main-post-item');
    this.newsSectionHeader = page.getByTestId("news-section-header");
    this.newsItemTitle = page.getByTestId("news-item-title").first();
    this.newsItemSportType = page.getByTestId("news-item-sport-type").first();
    this.newsItemTime = page.getByTestId("news-item-time").first();
    this.newsItemComments = page.getByTestId("news-item-comments").first();
    this.newsItemButton = page.getByTestId("news-section-button-al");

    this.burgerMenu = page.locator("svg").first();

    this.topPostSection = page.getByTestId("top-post-section");
    this.topPostTime = page.getByTestId("top-post-time");
    this.topPostTitle = page.getByTestId("top-post-title");
    this.topPostSubTitle = page.getByTestId("top-post-sub-title");
    this.topPostComments = page.getByTestId("top-post-comments");

    this.blogsItemTitle = page.getByTestId("post-item-title").first();
    this.blogsItemImg = page.getByTestId("post-item-img").first();
    this.blogsItemDescription = page.getByTestId("post-item-description").first();
    this.blogsItemTime = page.getByTestId("post-item-time").first();
    this.blogsItemComments = page.getByTestId("post-item-comments").first();
    this.blogsItemPlus = page.getByTestId("post-item-plus").first();

    this.bestBlogsWidget = page.getByTestId("best-post-not-editorial-section");
    this.bestBlogsWidgetHeader = page.getByTestId("best-post-not-editorial-section-header");
    this.bestBlogsWidgetButton = page.getByTestId("best-post-not-editorial-section-button-all");
    this.bestBlogsWidgetItem = this.bestBlogsWidget.getByTestId("best-post-item").first();
    this.bestBlogsItemTitle = this.bestBlogsWidgetItem.getByTestId("best-post-item-title");
    this.bestBlogsItemAuthor = this.bestBlogsWidgetItem.getByTestId("best-post-item-author");
    this.bestBlogsItemTime = this.bestBlogsWidgetItem.getByTestId("best-post-item-time");
    this.bestBlogsItemComments = this.bestBlogsWidgetItem.getByTestId("best-post-item-сomments")
    this.bestBlogsItemPlus = this.bestBlogsWidgetItem.getByTestId("best-post-item-plus");

    this.newBlogsWidget = page.getByTestId("best-post-editorial-section");
    this.newBlogsWidgetHeader = page.getByTestId("best-post-editorial-section-header");
    this.newBlogsWidgetButton = page.getByTestId("best-post-editorial-section-button-all");
    this.newBlogsWidgetItem = this.newBlogsWidget.getByTestId("best-post-item").first();
    this.newBlogsItemTitle = this.newBlogsWidgetItem.getByTestId("best-post-item-title");
    this.newBlogsItemAuthor = this.newBlogsWidgetItem.getByTestId("best-post-item-author");
    this.newBlogsItemTime = this.newBlogsWidgetItem.getByTestId("best-post-item-time");
    this.newBlogsItemComments = this.newBlogsWidgetItem.getByTestId("best-post-item-сomments")
    this.newBlogsItemPlus = this.newBlogsWidgetItem.getByTestId("best-post-item-plus");


    this.bookieWidget = page.getByTestId("bookie-widget").last();
    this.bookieWidgetMobile = page.getByTestId("bookie-widget").first();
    this.bookieWidgetButton = this.bookieWidget.getByTestId("bookie-widget-item-button-all");
    this.bookieWidgetTitle = this.bookieWidget.getByTestId("bookie-widget-header");
    this.bookieWidgetTab = this.bookieWidget.getByTestId("bookie-widget-bookie-tab");
    this.bookieCasinoTab = this.bookieWidget.getByTestId("bookie-widget-casino-tab");
    this.bookieWidgetButtonMobile = this.bookieWidgetMobile.getByTestId("bookie-widget-item-button-all");
    this.bookieWidgetTitleMobile = this.bookieWidgetMobile.getByTestId("bookie-widget-header");
    this.bookieWidgetTabMobile = this.bookieWidgetMobile.getByTestId("bookie-widget-bookie-tab");
    this.bookieCasinoTabMobile = this.bookieWidgetMobile.getByTestId("bookie-widget-casino-tab");
    this.bookieWidgetItem = this.bookieWidget.getByTestId("bookie-widget-item");
    this.bookieWidgetItemLogo = this.bookieWidget.getByTestId("bookie-widget-logo");
    this.bookieWidgetItemBonus = this.bookieWidget.getByTestId("bookie-widget-item-bonus");
    this.bookieWidgetItemBonusIcon = this.bookieWidget.getByTestId("bookie-widget-item-bonus-icon")
    this.bookieWidgetItemReviewIcon = this.bookieWidget.getByTestId("bookie-widget-item-review-icon")

    this.tableWidget = page.locator("._widget_tcfn2_1");
    this.tableWidgetDropdown = this.tableWidget.locator("._dropdown_1mrn9_1")
    this.tableWidgetTitle = this.tableWidget.locator("._widget__title_tcfn2_9");
    this.tableWidgetButton = this.tableWidget.locator("._btn_7mro5_1");

    this.bestPlayersWidget = page.locator("._widget_1d80w_1");
    this.bestPlayersWidgetButton = this.bestPlayersWidget.locator("._btn_7mro5_1");
    this.bestPlayersWidgetTabs = this.bestPlayersWidget.locator(".swiper-slide");

    this.footer = page.locator('div[class*="_footer__bottom_"]');
    this.footerMainItems = this.footer.locator(".Footer_footer__title__QNaa7")
    this.footerCopyrights = this.footer.locator('[class*="_footer__copyright"]')
    this.footerBottomRightColumn = this.footer.locator('[class*="_footer__bottom-right-column"]');
    this.footerBadgesGWPA = this.footerBottomRightColumn.locator('[class*="_footer__gpwa"]');
    this.footerBadges18Plus = this.footerBottomRightColumn.locator('[class*="_footer__eighteen-plus"]');
    this.footerBadgesAAMS = this.footerBottomRightColumn.locator('img[alt="aams license"]');
    this.footerBadgesADM = this.footerBottomRightColumn.locator('img[alt="adm logo"]');
    this.footerBadgesGioco = this.footerBottomRightColumn.locator('img[alt="gioco logo"]');
    this.footerBeAware = this.footerBottomRightColumn.locator('svg[class*="_footer__be-aware"]');

    this.breadcrumbsINT = this.page.locator(
      'div[class*="Breadcrumbs-module__"][class*="breadcrumbs"], [class*="blog-page__breadcrumbs"], [data-test="breadcrumbs"], [data-test="tag-header-breadcrumbs"]'
    );
    this.breadcrumbsUaBy = this.page.locator('.breadcrumbs, [class*="blog_page__breadcrumbs"], [data-test="breadcrumbs"], [data-test="tag-header-breadcrumbs"]');

    this.tagList = page.locator('[class*="_tag-thumbnails-list"]').first();

    this.consentButton = page.locator('[class="fc-primary-button"]').first();
    this.fullScreenCloseBtn = page.locator('[class*="mobile-full-screen-content__close-btn"], [class*="mobile_full_screen_content__close_btn"]').first();
  }

  async checkElementsInMenuExact(elements) {
    for (const text of elements) {
      const item = this.page.getByRole("link", { name: text, exact: true });

      await expect(item).toBeVisible();
    }
  }

  async checkElementsInMenu(elements) {
    for (const text of elements) {
      const item = this.page.getByRole("link", { name: text });

      await expect(item).toBeVisible();
    }
  }

  async checkElementIsVisible(locator, options = {}) {
    await expect(locator).toBeVisible();
    if (options.name) {
      await expect(locator).toHaveText(options.name);
    }
  }

  // модалки підписки на розсилку (казино / букмекери) з'являються через ~30 с і перекривають сторінку;
  // сайт показує їх раз за сесію, тож позначаємо їх як уже показані. Викликати до page.goto
  async disableEmailsModals() {
    await this.page.context().addInitScript(() => {
      try {
        sessionStorage.setItem("casinoEmailsModalShown", "true");
        sessionStorage.setItem("bookieEmailsModalShown", "true");
      } catch {}
    });
  }

  // protected link (span з onClick) до гідрації не має обробника і клік нічого не відкриває,
  // тому клікаємо повторно, доки не відкриється нова вкладка.
  // Слухаємо подію весь час, щоб вкладка не загубилась, навіть якщо клік триває довго (перерендер елемента)
  async clickAndWaitForPopup(locator, timeout = 60000) {
    let popup;
    const onPopup = (newPage) => { popup = popup || newPage; };
    this.page.on("popup", onPopup);
    try {
      await expect(async () => {
        // короткий таймаут кліку: якщо елемент підмінили (span -> a) і він став прихованим,
        // клік обірветься, а повтор заново знайде видимий елемент
        if (!popup) await locator.click({ timeout: 5000 });
        // на повільній машині вкладка відкривається через кілька секунд після кліку
        await expect.poll(() => !!popup, { timeout: 10000 }).toBe(true);
      }).toPass({ timeout });
    } finally {
      this.page.off("popup", onPopup);
    }
    return popup;
  }

  async checkElementIsClickable(locator, options = {}) {
    await this.checkElementIsVisible(locator, options);
    const isEnabled = await locator.isEnabled();
    expect(isEnabled).toBe(true);
  }

  async verifyRedirect(locator, expectedUrlPart) {
    const context = this.page.context();

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      locator.click(),
    ]);

    await newPage.waitForLoadState("domcontentloaded");
    expect(newPage.url()).toContain(expectedUrlPart);
    await newPage.close();
  }

  async clickElement(locator) {
    await locator.click();
  }

  async countElements(locator, number) {
    await expect(locator).toHaveCount(number);
  }

  async clickOnBurgerMenu() {
    await this.burgerMenu.click();
  }

  async checkMainSectionsInFooter(elements) {
    for (const text of elements) {
      const item = this.footerMainItems.getByText(text)

      await expect(item).toBeVisible();
    }
  }

  getBreadcrumbsContainer(project) {
    const breadcrumbs = project === "INT"
      ? this.breadcrumbsINT
      : this.breadcrumbsUaBy;

    return breadcrumbs.first();
  }

  async getBreadcrumb(name, project) {
    const breadcrumbs = this.getBreadcrumbsContainer(project);
    await expect(breadcrumbs).toBeVisible();

    const inlineCrumb = breadcrumbs
      .getByText(name, { exact: false })
      .and(this.page.locator(':not([role="menuitem"])'))
      .first();

    if (await inlineCrumb.isVisible()) {
      return inlineCrumb;
    }

    const moreToggle = breadcrumbs.locator('input[class*="_breadcrumbs__more-toggle"]');
    const moreButton = breadcrumbs.locator('label[class*="_breadcrumbs__more-button"]');
    const dropdown = breadcrumbs.locator('[class*="_breadcrumbs__dropdown_"]');

    if (!(await moreToggle.isChecked())) {
      await moreButton.click();
    }
    await expect(dropdown).toBeVisible();

    return dropdown.getByRole("menuitem", { name });
  }

  async closeBreadcrumbsDropdown(project) {
    const breadcrumbs = this.getBreadcrumbsContainer(project);
    const moreToggle = breadcrumbs.locator('input[class*="_breadcrumbs__more-toggle"]');

    if ((await moreToggle.count()) && (await moreToggle.isChecked())) {
      await breadcrumbs.locator('label[class*="_breadcrumbs__more-button"]').dispatchEvent("click");
    }
  }

  async checkItemsInBreadcrumbs(expectedCrumbs, project) {
    for (const crumb of expectedCrumbs) {
      await expect(await this.getBreadcrumb(crumb, project)).toBeVisible();
    }

    await this.closeBreadcrumbsDropdown(project);
  }

  async checkItemsInTagList(expectedTags) {

    for (const tag of expectedTags) {
      await expect(this.tagList.getByText(tag, { exact: false })).toBeVisible();
    }
  }

  async acceptConsent() {
    if (await this.consentButton.isVisible()) {
      await this.consentButton.click();
    }
  }

  async closeMobileFullScreen() {
    if (await this.fullScreenCloseBtn.isVisible()) {
      await this.fullScreenCloseBtn.click();
    }
  }

  async checkCanonicalLink() {
    const canonical = this.page.locator('link[rel="canonical"]');
    const expectedUrl = this.page.url();
    await expect(canonical).toHaveAttribute('href', expect.stringContaining(expectedUrl));
  }

  async getElementHref(locator) {
    return await locator.getAttribute('href');
  }

  // href бувають абсолютні й відносні, тому зводимо їх до pathname + hash;
  // посилання на чужий домен лишаємо повним, щоб воно було видно в diff.
  // Береться посилання, у якому лежить елемент (сам <a> або його предок); null - елемент не в посиланні
  async getLinkPaths(locator) {
    const pageUrl = this.page.url();
    const { origin } = new URL(pageUrl);
    const hrefs = await locator.evaluateAll(els => els.map(el => el.closest('a[href]')?.getAttribute('href') ?? null));
    return hrefs.map(href => {
      if (!href) return href;
      const url = new URL(href, pageUrl);
      return url.origin === origin ? url.pathname + url.hash : url.href;
    });
  }

  // checks: { ключ: локатор або [локатори] }, links: { ключ: очікуване посилання або [посилання] }.
  // Замість масиву можна передати matcher на весь список, напр. expect.arrayContaining([...]), коли порядок не важливий;
  // шаблон для одного посилання (expect.stringMatching) все одно передавай у масиві.
  // Перевіряються тільки передані ключі links; кожен локатор ключа має дати рівно ці посилання.
  // soft + poll: повторюємо, поки блок догружається, і збираємо всі розбіжності за один прогін
  async checkLinkPaths(checks, links) {
    const softExpect = expect.configure({ soft: true });

    // захист від опечатки в ключі, інакше перевірка мовчки пропуститься
    const unknownKeys = Object.keys(links).filter((key) => !checks[key]);
    expect(unknownKeys, 'unknown link keys').toEqual([]);

    for (const [name, expected] of Object.entries(links)) {
      const isListMatcher = typeof expected?.asymmetricMatch === 'function';
      const expectedList = Array.isArray(expected) || isListMatcher ? expected : [expected];

      for (const locator of [checks[name]].flat()) {
        await softExpect.poll(() => this.getLinkPaths(locator), { message: `${name} links: ${locator}` }).toEqual(expectedList);
      }
    }
  }
}

// Matcher на весь список посилань для checkLinkPaths, коли точний склад списку змінюється з часом:
// є хоча б одне посилання, і кожне відповідає шаблону. null (елемент без href - захищене посилання) пропускається;
// { allowMissing: false } - коли посилання мусить бути в кожному елементі, і null теж має валити перевірку
export function linksMatching(pattern, { allowMissing = true } = {}) {
  const description = `linksMatching(${pattern}${allowMissing ? '' : ', no missing links'})`;
  return {
    // позначка, за якою expect друкує matcher у звіті як description, а не як об'єкт
    $$typeof: Symbol.for('jest.asymmetricMatcher'),
    asymmetricMatch: (links) => Array.isArray(links)
      && links.some((link) => link !== null)
      && links.every((link) => (allowMissing && link === null) || (link !== null && pattern.test(link))),
    toString: () => description,
    toAsymmetricMatcher: () => description,
  };
}
