import { expect } from '@playwright/test';
import { MainPage } from './main.page';

export class MatchCenterPage extends MainPage {
    constructor(page) {
        super(page);
        this.page = page;
        const BASE_URL = process.env.BASE_URL;

        // Header & Navigation
        this.pageTitle = page.getByRole('heading', { level: 1 });

        // Datepicker
        this.dateLinks = page.locator('a[class*="DateTab-module_date-tab"]'); // "a": a date with favorite matches has a heart svg with the same class prefix
        this.activeDateLink = page.locator('[class*="DateTab-module_date-tab--active"]');
        this.dateList = page.locator('.swiper', { has: this.dateLinks });
        // this.datePickerPrevButton = page.locator('[class*="DateList-module"][class*="__prev"]');
        // this.datePickerNextButton = page.locator('[class*="DateList-module"][class*="__next"]');
        this.calendarPicker = page.locator('[class*="match-calendar"]');
        this.calendarIcon = page.locator('[class*="match-calendar__icon"]');

        // Calendar popup
        this.calendarPopup = page.locator('[class*="_match-calendar__modal"]');
        this.calendarCurrentMonth = this.calendarPopup.locator('[class*="_calendar__month"]');
        this.calendarCurrentYear = this.calendarPopup.locator('[class*="_calendar__year"]');
        this.calendarWeekDay = this.calendarPopup.locator('th[class*="_calendar__weekday"]');
        this.calendarPrevMonthButton = this.calendarPopup.locator('[class*="_calendar__top"]').locator('svg').nth(0);
        this.calendarNextMonthButton = this.calendarPopup.locator('[class*="_calendar__top"]').locator('svg').nth(1);
        this.calendarDays = this.calendarPopup.locator('[class*="_calendar__date_"]');
        this.calendarActiveDay = this.calendarPopup.locator('td[class*="_calendar__date--choosen"]');
        this.calendarTodayDay = this.calendarPopup.locator('td[class*="_calendar__date--today_"]');


        // Tabs
        this.allTab = page.locator('[class*="HeaderTab-module_tab"]').first();
        this.liveTab = page.locator('[class*="HeaderTab-module_tab"]').nth(1);
        this.myMatchesTab = page.locator('[class*="HeaderTab-module_tab"]').nth(2);
        this.tournamentsTab = page.locator('[class*="HeaderTab-module_tab"]').nth(3);

        // Match List Elements
        // Tournament Card
        this.tournamentMatchList = page.locator('[class*="MatchesWidget-module_matches-widget"]');
        this.tournamentMatchListHeader = this.tournamentMatchList.locator('[class*="MatchWidgetHeader-module_matches-widget__header"]');
        this.tournamentMatchListHeaderTournamentLogo = this.tournamentMatchListHeader.locator('img').first();
        this.tournamentMatchListHeaderTournamentName = this.tournamentMatchListHeader.locator('[class*="MatchWidgetHeader-module_matches-widget__text"]');
        this.tournamentMatchListHeaderTournamentTableLink = this.tournamentMatchListHeader.locator('[class*="MatchWidgetHeader-module_matches-widget__table-text"]');
        this.tournamentMatchListMatchHeaderTournamenttableLinkArrow = this.tournamentMatchListHeaderTournamentLogo.locator('svg');
        this.tournamentMatchListMatchRow = this.tournamentMatchList.locator('[class*="MatchRow-module_match-row"]');
        this.tournamentMatchListMatchRowMain = this.tournamentMatchList.locator('[class*="MatchRow-module_match-row__main"]'); // match link + favorite heart
        this.tournamentMatchListMatchRowHomeTeamSection = this.tournamentMatchListMatchRow.locator('[class*="MatchRow-module_match-row__home"]');
        this.tournamentMatchListMatchRowAwayTeamSection = this.tournamentMatchListMatchRow.locator('[class*="MatchRow-module_match-row__away"]');
        this.tournamentMatchListMatchRowHomeTeamLogo = this.tournamentMatchListMatchRowHomeTeamSection.locator('img');
        this.tournamentMatchListMatchRowAwayTeamLogo = this.tournamentMatchListMatchRowAwayTeamSection.locator('img');
        this.tournamentMatchListMatchRowHomeTeamName = this.tournamentMatchListMatchRowHomeTeamSection.locator('span');
        this.tournamentMatchListMatchRowAwayTeamName = this.tournamentMatchListMatchRowAwayTeamSection.locator('span');
        this.tournamentMatchListMatchRowStatus = this.tournamentMatchListMatchRow.locator('[class*="MatchRow-module_match-row__status"]');
        this.tournamentMatchListMatchRowStatusTime = this.tournamentMatchListMatchRowStatus.locator('[class*="MatchScheduledDate-module_match-row__date"]');
        this.tournamentMatchListMatchRowStatusScore = this.tournamentMatchListMatchRowStatus.locator('[class*="MatchRow-module_match-row__score"]');
        this.tournamentMatchListStatsLink = this.tournamentMatchList.locator('[class*="MatchesWidget-module_matches-widget__stat-text"]');
        this.tournamentMatchListStatsLinkArrow = this.tournamentMatchListStatsLink.locator('svg');
        this.tournamentMatchListFavoriteIcon = this.tournamentMatchListMatchRow.locator('[data-test="favorite-match-mark"]');
        this.matchRowVideoLink = page.getByTestId('tag-match-row-video-link');

        // SEO Text Block
        this.seoTextBlock = page.getByTestId('structured-body');
        this.seoH2Headers = this.seoTextBlock.locator('h2');
        this.seoH3Headers = this.seoTextBlock.locator('h3');
        this.seoParagraphs = this.seoTextBlock.locator('p');
        this.seoUl = this.seoTextBlock.locator('ul');
        this.seoLi = this.seoUl.locator('li');

        // Match Card favourite button
        this.matchListContainer = this.page.locator('[class*="MatchesList-module_matches-list"]');
        this.matchRow = this.matchListContainer.locator('[class*="MatchRow-module_match-row__main_"]').first();
        this.favoriteMatchButton = this.matchRow.getByTestId('favorite-match-mark');
        this.favoriteMatchButtonFilled = this.favoriteMatchButton.locator('svg[class*="FavoriteMatchMark-module_favorite-mark--filled_"]');
        this.favoriteMatchButtonEmpty = this.favoriteMatchButton.locator('svg[class*="FavoriteMatchMark-module_favorite-mark--empty_"]');
    }

    getMatchRowBySlug(slug) {
        return this.tournamentMatchListMatchRowMain.filter({ has: this.page.locator(`a[href*="/match/${slug}/"]`) });
    }

    waitForGraphqlResponse(...operationNames) {
        return this.page.waitForResponse((response) => {
            if (!response.url().includes('graphql') || response.request().method() !== 'POST') return false;
            try {
                return operationNames.includes(response.request().postDataJSON()?.operationName);
            } catch {
                return false;
            }
        }, { timeout: 15000 });
    }

    // Returns the addFavoriteMatch / removeFavoriteMatch response triggered by the click
    async clickFavoriteMark(favoriteMark) {
        const toggled = this.waitForGraphqlResponse('addFavoriteMatch', 'removeFavoriteMatch');
        await favoriteMark.click();
        return toggled;
    }

    async getFavoriteListMatchIds(favoriteMatchesByDateResponse) {
        const { data } = await favoriteMatchesByDateResponse.json();
        return (data?.userSubscriptionsQueries?.favoriteMatchesByDate?.tournaments ?? [])
            .flatMap(({ matches }) => matches.map((match) => String(match.id)));
    }

    // "2026-10-08" from "/football/match/2026-10-08/"
    async getActiveDate() {
        return (await this.activeDateLink.getAttribute('href')).match(/\d{4}-\d{2}-\d{2}/)[0];
    }

    getDateLink(isoDate) {
        return this.dateLinks.and(this.page.locator(`[href*="/${isoDate}/"]`));
    }

    async getDateLinksDates() {
        const hrefs = await this.dateLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
        return hrefs.map((href) => href.match(/\d{4}-\d{2}-\d{2}/)[0]);
    }

    // The date list is a virtual swiper: it renders more dates than it shows, so take only the fully shown ones
    async getVisibleDates() {
        const list = await this.dateList.boundingBox();
        return this.dateLinks.evaluateAll((links, { x, width }) => links
            .filter((link) => {
                const { left, right } = link.getBoundingClientRect();
                return left >= x - 1 && right <= x + width + 1;
            })
            .map((link) => link.getAttribute('href').match(/\d{4}-\d{2}-\d{2}/)[0]), list);
    }

    shiftDate(isoDate, days) {
        const date = new Date(`${isoDate}T00:00:00Z`);
        date.setUTCDate(date.getUTCDate() + days);
        return date.toISOString().slice(0, 10);
    }

    // First day of the month shifted by months: ("2026-10-08", 2) => "2026-12-01"
    shiftMonth(isoDate, months) {
        const [year, month] = isoDate.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1 + months, 1)).toISOString().slice(0, 10);
    }

    // Consecutive dates: ("2026-10-08", 3) => ["2026-10-08", "2026-10-09", "2026-10-10"]
    getDatesFrom(isoDate, count) {
        return Array.from({ length: count }, (_, i) => this.shiftDate(isoDate, i));
    }

    // After a click the selected date is shown second from the left at any width
    async checkSelectedDatePosition(isoDate) {
        await expect.poll(async () => (await this.getVisibleDates()).slice(0, 2)).toEqual([this.shiftDate(isoDate, -1), isoDate]);
    }

    // Dates loaded into the list while scrolling go day by day, without gaps and repeats
    async checkDateListIsConsecutive() {
        const dates = await this.getDateLinksDates();
        expect(dates).toEqual(this.getDatesFrom(dates[0], dates.length));
    }

    // The date list is an infinite virtual swiper (overflow hidden + transform): a date out of view is not rendered yet,
    // so drag the list like a user until the date is fully shown, the list loads more dates on the way
    async scrollDateListTo(isoDate) {
        const list = await this.dateList.boundingBox();
        const y = list.y + list.height / 2;
        // Keep off the list edges: the invisible prev/next arrows there intercept the pointer
        const left = list.x + list.width * 0.15;
        const right = list.x + list.width * 0.85;

        await expect(async () => {
            const visibleDates = await this.getVisibleDates();
            if (visibleDates.length && !visibleDates.includes(isoDate)) {
                const [fromX, toX] = isoDate < visibleDates[0] ? [left, right] : [right, left];
                await this.page.mouse.move(fromX, y);
                await this.page.mouse.down();
                await this.page.mouse.move(toX, y, { steps: 10 });
                await this.page.mouse.up();
            }
            // Checked before the drag: the next try reads the list once the swiper has settled
            expect(visibleDates).toContain(isoDate);
        }).toPass({ intervals: [500], timeout: 60000 });
        await expect(this.getDateLink(isoDate)).toBeInViewport({ ratio: 1 });
    }

    // A click on the icon before hydration is lost, so repeat it until the calendar opens
    async openCalendar() {
        await expect(async () => {
            await this.calendarIcon.locator('..').click(); // Clicking parent as it's an SVG
            await expect(this.calendarPopup).toBeVisible({ timeout: 2000 });
        }).toPass({ timeout: 15000 });
    }

    // The calendar header shows the month in the nominative case ("октябрь"), unlike the page title ("октября")
    async checkCalendarMonth(isoDate, locale) {
        const date = new Date(`${isoDate}T00:00:00Z`);
        const monthName = new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(date);
        await expect(this.calendarCurrentMonth).toHaveText(monthName);
        await expect(this.calendarCurrentYear).toHaveText(String(date.getUTCFullYear()));
    }

    async getMatchCenterTabs() {
        const matchCenterPage = new MatchCenterPage(this.page);
        await matchCenterPage.checkElementIsVisible(matchCenterPage.allTab);
        await matchCenterPage.checkElementIsVisible(matchCenterPage.liveTab);
        await matchCenterPage.checkElementIsVisible(matchCenterPage.myMatchesTab);
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentsTab);
    }

    async getTournamentMatchList() {
        const matchCenterPage = new MatchCenterPage(this.page);

        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchList.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListHeader.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListHeaderTournamentLogo.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListHeaderTournamentName.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListHeaderTournamentTableLink.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListMatchRowHomeTeamLogo.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListMatchRowAwayTeamLogo.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListMatchRowHomeTeamName.nth(0));
        await matchCenterPage.checkElementIsVisible(matchCenterPage.tournamentMatchListMatchRowAwayTeamName.nth(0));
    };

    async getMatchCenterSeoBlock(seoH2Headers, numH3, numPar, numUl, numLi) {
        const matchCenterPage = new MatchCenterPage(this.page);
        await matchCenterPage.checkElementIsVisible(matchCenterPage.seoTextBlock);
        await matchCenterPage.checkElementIsVisible(matchCenterPage.seoH2Headers);
        expect(matchCenterPage.seoH2Headers).toContainText(seoH2Headers);
        for (let i = 0; i < numH3; i++) {
            await matchCenterPage.checkElementIsVisible(matchCenterPage.seoH3Headers.nth(i));
            expect(matchCenterPage.seoH3Headers.nth(i)).not.toBeNull();
        }
        for (let i = 0; i < numPar; i++) {
            await matchCenterPage.checkElementIsVisible(matchCenterPage.seoParagraphs.nth(i));
            expect(matchCenterPage.seoParagraphs.nth(i)).not.toBeNull();
        }

        for (let i = 0; i < numUl; i++) {
            await matchCenterPage.checkElementIsVisible(matchCenterPage.seoUl.nth(i));
            expect(matchCenterPage.seoUl.nth(i)).not.toBeNull();
        }

        for (let i = 0; i < numLi; i++) {
            await matchCenterPage.checkElementIsVisible(matchCenterPage.seoLi.nth(i));
            expect(matchCenterPage.seoLi.nth(i)).not.toBeNull();
        }
    }

    async getFormattedDateFromUrl(url, locale) {
        const regex = /\d{4}-\d{2}-\d{2}/;
        const match = url.match(regex);

        if (!match) {
            return "Date not found in url";
        }

        const dateString = match[0];

        const date = new Date(dateString);

        const formatter = new Intl.DateTimeFormat(locale, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        });

        let formattedDate = formatter.format(date);

        if (locale === 'ru' || locale === 'uk' || locale === 'be') {
            formattedDate = formattedDate.replace(/\s*[гр]\.?$/, '');
        } else if (locale === 'de') {
            formattedDate = formattedDate.replace(/^(\d+)\./, '$1').toLowerCase();
        }

        return formattedDate;
    }


    async addMatchToFavourite() {
        await expect(this.favoriteMatchButton).toBeVisible();
        await expect(
            this.favoriteMatchButtonEmpty.or(this.favoriteMatchButtonFilled)
        ).toBeVisible();

        if (await this.favoriteMatchButtonEmpty.isVisible()) {
            await this.favoriteMatchButtonEmpty.click();
            await expect(this.favoriteMatchButtonFilled).toBeVisible();
        } else {
            await this.favoriteMatchButtonFilled.click();
            await expect(this.favoriteMatchButtonEmpty).toBeVisible();

            await this.favoriteMatchButtonEmpty.click();
            await expect(this.favoriteMatchButtonFilled).toBeVisible();
        }
    }

}
