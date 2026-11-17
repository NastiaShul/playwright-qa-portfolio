import { expect } from "@playwright/test";
import { MainPage } from "./main.page";
import { SubscriptionComponent } from "./components/subscriptionComponent";
import { WidgetsComponent } from "./components/widgetsComponent";

export class TagPage extends MainPage {
    constructor(page) {
        super(page);
        this.subscription = new SubscriptionComponent(page);
        this.widgets = new WidgetsComponent(page);

        this.dropdown = page.getByTestId("dropdown");
        this.dropdownItem = this.dropdown.getByTestId("dropdown-item");

        this.header = page.getByTestId("tag-header");
        this.tagBreadcrumbs = this.header.getByTestId("tag-header-breadcrumbs");
        this.tagLogo = this.header.getByTestId("tag-header-main-image").locator("img");
        this.tagLogoAdditional = this.header.getByTestId("tag-header-additional-image").locator("img");
        this.tagTags = this.header.getByTestId("tag-header-tags");
        this.tagTitle = this.header.getByTestId("tag-header-title");
        this.tagSubtitle = this.header.getByTestId("tag-header-subtitle");
        this.tagHeaderTabs = this.header.getByTestId("tag-header-tabs");
        this.tagHeaderTabItem = this.tagHeaderTabs.getByTestId("tag-tab-item")
        this.tagSubscribers = this.header.locator('[class*="_tag-header__subscribers"]');
        this.headerContent = page.getByTestId("tag-header-content");


        this.personNumber = this.header.locator('[class*="_tag-header__content-additional-info"]').locator("span").first();
        this.personTeam = this.header.getByTestId("tag-person-team");
        this.personPosition = this.header.getByTestId("tag-person-position");
        this.personAge = this.header.getByTestId("tag-person-age");
        this.personHeight = this.header.getByTestId("tag-person-height");
        this.personWeight = this.header.getByTestId("tag-person-weight");
        this.personNationality = this.header.getByTestId("tag-person-nationality");
        this.personSeasonStatLink = this.header.getByTestId("tag-person-season-stat-link");
        this.personSeasonStatValue = this.header.getByTestId("tag-person-season-stat-value");
        this.personSeasonStatName = this.header.getByTestId("tag-person-season-stat-name");

        this.body = page.getByTestId("tag-body");

        this.tagFixtures = this.body.getByTestId("tag-fixtures").first();
        this.tagFixturesMatch = this.tagFixtures.getByTestId('tag-fixtures-match').first();
        this.tagFixturesMatchRow = this.tagFixtures.getByTestId('tag-fixtures-match');
        this.tagFixturesMatchInfoStatus = this.tagFixturesMatchRow.getByTestId("tag-fixtures-match-status");
        this.tagFixturesMatchInfo = this.tagFixturesMatchRow.getByTestId("tag-fixtures-match-info");
        this.tagFixturesMatchInfoHomeTeam = this.tagFixturesMatchInfo.getByTestId("tag-fixtures-match-home");
        this.tagFixturesMatchInfoHomeTeamName = this.tagFixturesMatchInfoHomeTeam.locator("span");
        this.tagFixturesMatchInfoHomeTeamLogo = this.tagFixturesMatchInfoHomeTeam.locator("img");
        this.tagFixturesMatchInfoHomeAwayTeam = this.tagFixturesMatchInfo.getByTestId("tag-fixtures-match-away");
        this.tagFixturesMatchInfoAwayTeamName = this.tagFixturesMatchInfoHomeAwayTeam.locator("span");
        this.tagFixturesMatchInfoAwayTeamLogo = this.tagFixturesMatchInfoHomeAwayTeam.locator("img");
        this.tagFixturesMatchInfoScore = this.tagFixturesMatchInfo.getByTestId("tag-fixtures-match-score");
        this.tagFixturesMatchFavButton = this.tagFixturesMatchRow.getByTestId("tag-fixtures-favorite-match-button");
        this.tagFixturesShowAllMatchesButton = this.tagFixtures.getByTestId("tag-fixtures-show-all-matches-button");

        this.tagNewsItem = this.body.getByTestId("tag-news-item").first();
        this.tagNewsItemTitle = this.tagNewsItem.getByTestId("tag-news-item-title");
        this.tagNewsItemInfo = this.tagNewsItem.locator(".NewsItem_news-item__info__kbpXY");
        this.tagNewsItemInfoPublishTime = this.tagNewsItem.getByTestId("tag-news-item-time");
        this.tagNewsItemInfoCommentsItem = this.tagNewsItem.getByTestId("tag-news-item-comments");

        this.newsItem = this.body.locator('[class*="news-item--show"]').first();
        this.newsItemTitle = this.newsItem.getByTestId("news-item-title");
        this.newsItemInfoPublishTime = this.newsItem.getByTestId("news-item-time");
        this.newsItemInfoCommentsItem = this.newsItem.getByTestId("news-item-comments");

        this.tagPostItem = this.body.getByTestId("tag-post-item").first();
        this.tagPostItemImage = this.tagPostItem.locator("[data-nimg]").first();
        this.tagPostItemBody = this.tagPostItem.locator("> div:last-of-type");
        this.tagPostItemTitle = this.tagPostItem.getByTestId("tag-post-item-title");
        this.tagPostItemInfo = this.tagPostItem.locator("> div:last-of-type");
        this.tagPostItemMainInfoPublishTime = this.tagPostItem.getByTestId("tag-post-item-time");
        this.tagPostItemMainInfoCommentsItem = this.tagPostItem.getByTestId('tag-post-item-comments');
        this.tagPostItemMainInfoLikesItem = this.tagPostItem.getByTestId("tag-post-item-plus");

        this.postItem = this.body.getByTestId("post-item").first();
        this.postItemImage = this.postItem.getByTestId("post-item-img");
        this.postItemTitle = this.postItem.getByTestId("post-item-title");
        this.postItemMainInfoPublishTime = this.postItem.getByTestId("post-item-time");
        this.postItemMainInfoCommentsItem = this.postItem.getByTestId('post-item-comments');
        this.postItemMainInfoLikesItem = this.postItem.getByTestId("post-item-plus");

        this.transfersWidget = this.body.getByTestId("tag-transfers-widget");
        this.transfersWidgetTitle = this.transfersWidget.getByTestId("tag-transfers-widget-title");
        this.transfersWidgetFullTransfersLink = this.transfersWidget.getByTestId("tag-transfers-widget-full-transfers-link");
        this.transfersWidgetSwiper = this.transfersWidget.locator(".swiper");
        this.transfersWidgetSwiperSlide = this.transfersWidget.getByTestId("tag-transfers-widget-slide").first();
        this.transfersWidgetPlayerMainLogo = this.transfersWidgetSwiperSlide.getByTestId("tag-transfers-widget-main-logo");
        this.transfersWidgetPlayerAdditionLogo = this.transfersWidgetSwiperSlide.getByTestId("tag-transfers-widget-additional-logo");
        this.transfersWidgetPlayerInfo = this.transfersWidgetSwiperSlide.getByTestId("tag-transfers-widget-player-info");
        this.transfersWidgetPlayerTransferDate = this.transfersWidgetSwiperSlide.getByTestId("tag-transfers-widget-transfer-date");
        this.transfersWidgetItemTeamsFrom = this.transfersWidgetSwiperSlide.getByTestId("tag-transfers-widget-team-from");
        this.transfersWidgetItemTeamsTo = this.transfersWidgetSwiperSlide.getByTestId("tag-transfers-widget-team-to");
        this.transfersWidgetTransferType = this.transfersWidgetSwiperSlide.getByTestId("tag-transfers-widget-transfer-type");

        this.theBestWidget = this.body.locator("._the-best_15u6b_1"); //data-test="tag-the-best-widget"
        this.theBestWidgetHeader = this.theBestWidget.locator("._the-best__header_15u6b_12");
        this.theBestWidgetTitle = this.theBestWidgetHeader.locator("h2"); //data-test="tag-the-best-widget-title"
        this.theBestWidgetFullStatLink = this.theBestWidgetHeader.locator("a"); //data-test="tag-the-best-widget-full-stat-link"
        this.theBestWidgetSwiper = this.theBestWidget.locator(".swiper");
        this.theBestWidgetSwiperSlide = this.theBestWidgetSwiper.locator(".swiper-slide").first(); //data-test="tag-the-best-widget-slide"
        this.theBestWidgetSwiperSlideStatTitle = this.theBestWidgetSwiperSlide.locator("._stat-block__title_15u6b_44"); //data-test="tag-the-best-widget-slide-stat-title"
        this.theBestWidgetSwiperSlideStatPlayer = this.theBestWidgetSwiperSlide.locator("._stat-block__player-row_15u6b_66").first(); //data-test="tag-the-best-widget-slide-stat-player"
        this.theBestWidgetSwiperSlideStatPlayerMainLogo = this.theBestWidgetSwiperSlideStatPlayer.locator("._stat-block__logo-wrapper-main-first_15u6b_78"); //data-test="tag-the-best-widget-slide-stat-player-main-logo"
        this.theBestWidgetSwiperSlideStatPlayerAdditionLogo = this.theBestWidgetSwiperSlideStatPlayer.locator("._stat-block__logo-wrapper-additional_15u6b_78"); //data-test="tag-the-best-widget-slide-stat-player-additional-logo"
        this.theBestWidgetSwiperSlideStatPlayerName = this.theBestWidgetSwiperSlideStatPlayer.locator("._stat-block__name_15u6b_52"); //data-test="tag-the-best-widget-slide-stat-player-name"
        this.theBestWidgetSwiperSlideStatPlayerValue = this.theBestWidgetSwiperSlideStatPlayer.locator("._stat-block__value_15u6b_60"); //data-test="tag-the-best-widget-slide-stat-player-value"

        this.seoTextWidget = this.body.getByTestId("structured-body");

        this.FAQWidget = this.body.getByTestId("faq").first();
        this.FAQWidgetTitle = this.FAQWidget.getByTestId("faq-title");
        this.FAQWidgetTagTitle = this.FAQWidget.getByTestId("tag-faq-title");
        this.FAQWidgetQuantity = this.FAQWidget.getByTestId("faq-quantity");
        this.FAQWidgetTagQuantity = this.FAQWidget.getByTestId("tag-faq-quantity");
        this.FAQWidgetClosedIcon = this.FAQWidget.getByTestId("faq-close-icon");
        this.FAQWidgetTagClosedIcon = this.FAQWidget.getByTestId("tag-faq-close-icon");
        this.FAQWidgetItem = this.FAQWidget.getByTestId("faq-item").first();
        this.FAQWidgetTagItemCount = this.FAQWidget.getByTestId("tag-faq-item");
        this.FAQWidgetTagItem = this.FAQWidget.getByTestId("tag-faq-item").first();
        this.FAQWidgetItemHeader = this.FAQWidgetItem.locator("h3");
        this.FAQWidgetTagItemHeader = this.FAQWidgetTagItem.locator("h3");
        this.FAQWidgetItemOpenIcon = this.FAQWidgetItem.locator("svg");
        this.FAQWidgetTagItemOpenIcon = this.FAQWidgetTagItem.locator("svg");
        this.FAQWidgetButton = this.FAQWidget.locator("button");

        this.calendarDropdowns = this.body.locator(".LeagueFixturesPage_league-fixtures-page__dropdown-wrapper__h7uol"); //data-test="calendar-dropdowns"

        this.tagPostTabs = this.body.locator('div[class*="PostsList_posts-list-header__tabs"]');
        this.tagPostTabPopular = this.tagPostTabs.locator('div[class*="slide-active"]'); //data-test="tag-post-tab-popular"
        this.tagPostTabNew = this.tagPostTabs.locator('div[class*="slide-next"]'); //data-test="tag-post-tab-new"
        this.tagCreatePostButton = this.body.locator(
            '[class*="_posts-list-header__create-post-button"], [data-post-create-post-button] > button'
        );
        this.tagPostTabPopularEn = this.page.locator('[data-tabs="Popular"]');
        this.tagPostTabNewEn = this.page.locator('[data-tabs="New"]');
        this.tagPostTabPopularRu = this.page.locator('[data-tabs="Популярные"]');
        this.tagPostTabNewRu = this.page.locator('[data-tabs="Новые"]');

        this.tagBestBlogsWidget = this.body.locator(".BlogsTable_blogs-widget__cbcYi"); //data-test="tag-the-best-blogs-widget"
        this.tagBestBlogsWidgetTitle = this.tagBestBlogsWidget.locator("h5");
        this.tagBestBlogsWidgetTable = this.tagBestBlogsWidget.locator("[data-best-blogs-table]"); //data-test="tag-the-best-blogs-widget-table"
        this.tagBestBlogsWidgetBlogItem = this.tagBestBlogsWidgetTable.locator(".BlogsTable_blogs-table__row__m_hXB").first(); //data-test="tag-the-best-blogs-widget-item"
        this.tagBestBlogsWidgetBlogItemLogo = this.tagBestBlogsWidgetBlogItem.locator("> a"); //data-test="tag-the-best-blogs-widget-item-logo"
        this.tagBestBlogsWidgetBlogItemTitle = this.tagBestBlogsWidgetBlogItem.locator(".BlogsTable_blogs-table__title__RBySs"); //data-test="tag-the-best-blogs-widget-item-title"
        this.tagBestBlogsWidgetBlogItemFollowers = this.tagBestBlogsWidgetBlogItem.locator(".BlogsTable_blogs-table__followers__moyr4"); //data-test="tag-the-best-blogs-widget-item-followers"

        this.tagStatWidgetBest = this.page.getByTestId("stat-widget-best");
        this.tagStatWidgetBestTable = this.tagStatWidgetBest.getByTestId("stat-widget-best-table");
        this.tagStatWidgetBestTableleHeader = this.tagStatWidgetBestTable.getByTestId("stat-widget-best-table-header");
        this.tagStatWidgetBestTableleHeaderPlayer = this.tagStatWidgetBestTableleHeader.getByTestId("stat-widget-best-table-header-player");
        this.tagStatWidgetBestTableleHeaderMetric = this.tagStatWidgetBestTableleHeader.getByTestId("stat-widget-best-table-header-metric");
        this.tagStatWidgetBestTableItem = this.tagStatWidgetBestTable.getByTestId("stat-widget-best-table-item").first();
        this.tagStatWidgetBestTableItemLogo = this.tagStatWidgetBestTableItem.getByTestId("stat-widget-best-table-item-logo");
        this.tagStatWidgetBestTableItemName = this.tagStatWidgetBestTableItem.getByTestId("stat-widget-best-table-item-name");
        this.tagStatWidgetBestTableItemTeam = this.tagStatWidgetBestTableItem.getByTestId("stat-widget-best-table-item-team");
        this.tagStatWidgetBestTableItemPoint = this.tagStatWidgetBestTableItem.getByTestId("stat-widget-best-table-item-points");

        this.tournamentStatWidget = this.body.getByTestId("stat-widget-tournament");
        this.tournamentStatWidgetStandingsControls = this.tournamentStatWidget.locator('div[class*="_standings-controls"]');
        this.tournamentStatWidgetTitle = this.tournamentStatWidget.getByTestId("stat-widget-tournament-title");
        this.tournamentStandingsTableFullStatButton = this.tournamentStatWidget.getByTestId("stat-widget-tournament-button");

        this.tournamentStandingsControls = this.body.locator('div[class*="standings-controls"]');
        this.tournamentStandingsTable = this.body.getByTestId("standings-tournaments-table");
        // this.tournamentStandingsTableHeader = this.tournamentStandingsTable.getByTestId("standings-tournaments-table-header");
        this.tournamentStandingsTableHeader = this.body.locator('thead').nth(0);
        this.tournamentStandingsTableHeaderTeam = page.getByTestId("standings-tournaments-table-header-team");
        // this.tournamentStandingsTableHeaderMetrics = page.locator('div[class*="table-header__metrics"]');
        this.tournamentStandingsTableHeaderPoints = page.getByTestId("standings-tournaments-table-header-points");
        this.tournamentStandingsTableHeaderMatches = page.getByTestId("standings-tournaments-table-header-matches");
        this.tournamentStandingsTableHeaderWins = page.getByTestId("standings-tournaments-table-header-wins");
        this.tournamentStandingsTableHeaderDraws = page.getByTestId("standings-tournaments-table-header-draws");
        this.tournamentStandingsTableHeaderLosses = page.getByTestId("standings-tournaments-table-header-losses");
        this.tournamentStandingsTableHeaderGoalDifference = page.getByTestId("standings-tournaments-table-header-goal-difference");
        this.tournamentStandingsTableHeaderScoredConceded = page.getByTestId("standings-tournaments-table-header-scored-conceded");
        this.tournamentStandingsTableHeaderLastFive = page.getByTestId("standings-tournaments-table-header-last-five");
        // this.tournamentStandingsTableItem = this.tournamentStandingsTable.getByTestId("standings-tournaments-table-item").first();
        this.tournamentStandingsTableItemRank = page.getByTestId("team-table-cell-rank");
        this.tournamentStandingsTableItemLogo = page.getByTestId("team-table-cell-logo");
        this.tournamentStandingsTableItemTeam = page.locator('[datatest="team-table-cell-team"]');
        this.tournamentStandingsTableItemPoint = page.getByTestId("standings-tournaments-table-item-point");
        this.tournamentStandingsTableItemMatches = page.getByTestId("standings-tournaments-table-item-matches");
        this.tournamentStandingsTableItemWins = page.getByTestId("standings-tournaments-table-item-item-wins");
        this.tournamentStandingsTableItemDraws = page.getByTestId("standings-tournaments-table-item-item-draws");
        this.tournamentStandingsTableItemLosses = page.getByTestId("standings-tournaments-table-item-item-losses");
        this.tournamentStandingsTableItemGoalDifference = page.getByTestId("standings-tournaments-table-item-item-goal-difference");
        this.tournamentStandingsTableItemScoredConceded = page.getByTestId("standings-tournaments-table-item-item-scored-conceded");
        // this.clubTableItemLast5Games = this.clubTableItem.locator('div=[class*="_last-five"]'); data-test= "standings-tournaments-table-item-last5"
        this.tournamentStandingsTableFooter = this.body.locator('div[class*="_table-footer"]');
        this.tournamentStandingsTableFooterLabels = this.tournamentStandingsTableFooter.locator('div[class*="_table-footer__labels"]');
        this.tournamentStandingsTableFooterLegends = this.tournamentStandingsTableFooter.locator('div[class*="_table-footer__legends"]');

        this.lastFiveModule = page.getByTestId("last-five-module");

        this.lastFiveMatchesWidget = this.body.getByTestId("tag-person-last-five-matches");
        this.lastFiveMatchesWidgetTitle = this.lastFiveMatchesWidget.getByTestId("tag-person-last-five-matches-title");
        this.lastFiveMatchesShowAllButton = this.lastFiveMatchesWidget.getByTestId("tag-person-last-five-matches-show-more-button");

        this.personSeasonMatchListTable = this.body.getByTestId("tag-person-season-match-list-table");
        this.personSeasonMatchListTableRow = this.body.getByTestId("tag-person-season-match-list-row");
        this.personSeasonMatchListRowResultBlock = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-result-block");
        this.personSeasonMatchListTableRowTournamentLogo = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-tournament-logo");
        this.personSeasonMatchListTableRowDate = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-date");
        this.personSeasonMatchListTableRowHomeTeamLogo = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-home-team-logo");
        this.personSeasonMatchListTableRowHomeTeamName = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-home-team-name");
        this.personSeasonMatchListTableRowAwayTeamLogo = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-away-team-logo");
        this.personSeasonMatchListTableRowAwayTeamName = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-away-team-name");
        this.personSeasonMatchListTableRowHomeTeamGoals = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-home-team-goals");
        this.personSeasonMatchListTableRowAwayTeamGoals = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-away-team-goals");
        this.personSeasonMatchListTableRowOnBench = this.personSeasonMatchListTableRow.locator('[class*="MatchStatRow-module_match-stat-row__on-the-bench"]');
        this.personSeasonMatchListTableRowNotInSquad = this.personSeasonMatchListTableRow.locator('[class*="MatchStatRow-module_match-stat-row__not-in-squad"]');
        this.personSeasonMatchListTableRowVideoIcon = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-video");
        this.personSeasonMatchListTableRowMinutesPlayed = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-minutes");
        this.personSeasonMatchListTableRowGoals = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-goals");
        this.personSeasonMatchListTableRowAssists = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-assists");
        this.personSeasonMatchListTableRowYellowCards = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-yellow-card");
        this.personSeasonMatchListTableRowRedCards = this.personSeasonMatchListTableRow.getByTestId("tag-person-season-match-list-row-red-card");
        this.personSeasonMatchListTableFooter = this.body.getByTestId("tag-person-season-match-list-footer");
        this.personSeasonMatchListTableFooterText = this.personSeasonMatchListTableFooter.getByTestId("tag-person-season-match-list-footer-text");
        this.personSeasonMatchListTableFooterColorIndicator = this.personSeasonMatchListTableFooter.getByTestId("tag-person-season-match-list-footer-color-indicator");

        this.aboutPlayerWidget = page.locator('[class*="_about-football-player_"]').first();
        this.aboutPlayerWidgetTitle = this.aboutPlayerWidget.locator('h2');
        this.aboutPlayerWidgetLabel = this.aboutPlayerWidget.locator('[class*="_about-widget-row__label_"]');
        this.aboutPlayerWidgetValue = this.aboutPlayerWidget.locator('[class*="_about-widget-row__data--text_"]');

        this.careerWidget = this.body.getByTestId("tag-person-career");
        this.careerWidgetTitle = this.careerWidget.getByTestId("tag-person-career-title");
        this.playerTournamentResultsWidget = this.body.locator('[class*="PersonTournamentsStat-module_person-tournament-stat"]');
        this.playerTournamentResultsWidgetTitle = this.playerTournamentResultsWidget.locator('h2');

        this.personTransferHistoryWidget = this.body.getByTestId("tag-person-transfer-history");
        this.personTransferHistoryWidgetTitle = this.personTransferHistoryWidget.locator("h2");
        this.personTransferHistoryRow = this.personTransferHistoryWidget.getByTestId("tag-person-transfer-history-row");
        this.personTransferHistoryRowLink = this.personTransferHistoryRow.locator("a");
        this.personTransferHistoryTeamLogo = this.personTransferHistoryRow.getByTestId("tag-person-transfer-history-team-logo");
        this.personTransferHistoryTeamName = this.personTransferHistoryRow.getByTestId("tag-person-transfer-history-team-name");
        this.personTransferHistoryDate = this.personTransferHistoryRow.getByTestId("tag-person-transfer-history-transfer-date");
        this.personTransferHistoryStatus = this.personTransferHistoryRow.getByTestId("tag-person-transfer-history-transfer-status");
        this.personTransferHistorySum = this.personTransferHistoryRow.getByTestId("tag-person-transfer-history-transfer-price");

        this.personTrophiesWidget = this.body.getByTestId("tag-person-career-trophies-player");
        this.personTrophiesWidgetTitle = this.personTrophiesWidget.getByTestId("tag-person-career-trophies-player-title");
        this.personTrophiesWidgetTable = this.personTrophiesWidget.getByTestId("tag-person-career-trophies-table");
        this.personTrophiesWidgetTableHeader = this.personTrophiesWidgetTable.getByTestId("tag-person-career-trophies-table-header");
        this.personTrophiesWidgetTableHeaderTeam = this.personTrophiesWidgetTableHeader.getByTestId("tag-person-career-trophies-table-header-team");
        this.personTrophiesWidgetTableHeaderTrophy = this.personTrophiesWidgetTableHeader.getByTestId("tag-person-career-trophies-table-header-trophies");
        this.personTrophiesWidgetTableTeamRow = this.personTrophiesWidgetTable.getByTestId("tag-person-career-trophies-table-team-row");
        this.personTrophiesWidgetTableTeamRowLogo = this.personTrophiesWidgetTableTeamRow.getByTestId("tag-person-career-trophies-table-team-row-logo");
        this.personTrophiesWidgetTableTeamRowName = this.personTrophiesWidgetTableTeamRow.getByTestId("tag-person-career-trophies-table-team-row-name");
        this.personTrophiesWidgetTableTeamRowExpandButton = this.personTrophiesWidgetTableTeamRow.getByTestId("tag-person-career-trophies-table-expand");
        this.personTrophiesWidgetTableTeamRowExpanderOpen = this.personTrophiesWidgetTableTeamRow.locator('[class*="Trophies-module_trophies__expander--open"]');
        this.personTrophiesWidgetTableTeamRowExpanderClose = this.personTrophiesWidgetTableTeamRow.locator('[class*="Trophies-module_trophies__expander--close"]');
        this.personTrophiesWidgetTableRowTrophy = this.personTrophiesWidgetTableTeamRow.getByTestId("tag-person-career-trophies-table-team-row-number");
        this.personTrophiesWidgetTableTrophyRow = this.personTrophiesWidgetTable.getByTestId("tag-person-career-trophies-table-trophies-row");
        this.personTrophiesWidgetTableTrophyRowTournament = this.personTrophiesWidgetTableTrophyRow.getByTestId("tag-person-career-trophies-table-trophies-row-tournament");
        this.personTrophiesWidgetTableTrophyRowSeason = this.personTrophiesWidgetTableTrophyRow.getByTestId("tag-person-career-trophies-table-trophies-row-season");
        this.personTrophiesWidgetTableTrophyRowTrophies = this.personTrophiesWidgetTableTrophyRow.locator('[class*="Trophies-module_trophies__cell--right"]');
        this.personTrophiesWidgetTableFooter = this.personTrophiesWidgetTable.locator("tfoot");
        this.personTrophiesWidgetTableFooterText = this.personTrophiesWidgetTableFooter.locator("td > span").first();
        this.personTrophiesWidgetTableFooterLegend = this.personTrophiesWidgetTableFooter.locator('[class*="Trophies-module_trophies__value"]');

        this.personInjuryHistoryWidget = this.body.getByTestId("tag-person-injury-history");
        this.personInjuryHistoryWidgetTitle = this.personInjuryHistoryWidget.getByTestId("tag-person-injury-history-title");
        this.personInjuryHistoryWidgetTable = this.personInjuryHistoryWidget.getByTestId("tag-person-injury-history-table");
        this.personInjuryHistoryWidgetTableHeader = this.personInjuryHistoryWidgetTable.getByTestId("tag-person-injury-history-table-header");
        this.personInjuryHistoryWidgetTableHeaderInjury = this.personInjuryHistoryWidgetTableHeader.getByTestId("tag-person-injury-history-table-header-injury");
        this.personInjuryHistoryWidgetTableHeaderDaysMissed = this.personInjuryHistoryWidgetTableHeader.getByTestId("tag-person-injury-history-table-header-days-missed");
        this.personInjuryHistoryWidgetTableHeaderMatchesMissed = this.personInjuryHistoryWidgetTableHeader.getByTestId("tag-person-injury-history-table-header-matches-missed");
        this.personInjuryHistoryWidgetTableHeaderClub = this.personInjuryHistoryWidgetTableHeader.getByTestId("tag-person-injury-history-table-header-club");
        this.personInjuryHistoryWidgetTableRow = this.personInjuryHistoryWidgetTable.getByTestId("tag-person-injury-history-table-row");
        this.personInjuryHistoryWidgetTableRowInjuryName = this.personInjuryHistoryWidgetTableRow.getByTestId("tag-person-injury-history-table-injury-name");
        this.personInjuryHistoryWidgetTableRowInjuryDate = this.personInjuryHistoryWidgetTableRow.getByTestId("tag-person-injury-history-table-injury-date");
        this.personInjuryHistoryWidgetTableRowDaysMissed = this.personInjuryHistoryWidgetTableRow.getByTestId("tag-person-injury-history-table-days-missed");
        this.personInjuryHistoryWidgetTableRowMatchesMissed = this.personInjuryHistoryWidgetTableRow.getByTestId("tag-person-injury-history-table-matches-missed");
        this.personInjuryHistoryWidgetTableRowClubLogo = this.personInjuryHistoryWidgetTableRow.getByTestId("tag-person-injury-history-table-club-logo");
        this.personInjuryHistoryWidgetTableFooter = this.personInjuryHistoryWidgetTable.getByTestId("tag-person-injury-history-table-footer");
        this.personInjuryHistoryWidgetTableFooterValues = this.personInjuryHistoryWidgetTableFooter.getByTestId("tag-person-injury-history-table-footer-values");
        this.personInjuryHistoryWidgetTableFooterText = this.personInjuryHistoryWidgetTableFooter.getByTestId("tag-person-injury-history-table-footer-text");



        this.personSeasonStatCard = this.page.getByTestId("tag-person-season-stat-card");
        this.personSeasonStatCardValue = this.page.getByTestId("tag-person-season-stat-card-value");
        this.personSeasonStatCardText = this.page.getByTestId("tag-person-season-stat-card-text");
        this.personSeasonStatCardSubtext = this.page.getByTestId("tag-person-season-stat-card-subtext");
        this.pesronSeasonStatCardYellowCard = this.page.getByTestId("tag-person-season-stat-card-yellow-card");
        this.pesronSeasonStatCardRedCard = this.page.getByTestId("tag-person-season-stat-card-red-card");

        this.personDetailedMatchStat = this.body.getByTestId("tag-person-match-stat");
        this.personDetailedMatchStatTitle = this.personDetailedMatchStat.getByTestId("tag-person-match-stat-title");
        this.personDetailedMatchStatDropdown = this.personDetailedMatchStat.getByTestId("tag-person-match-stat-dropdown");
        this.personDetailedMatchStatTeaser = this.personDetailedMatchStat.getByTestId("tag-fixtures-match");
        this.personDetailedMatchStatTeaserDate = this.personDetailedMatchStatTeaser.getByTestId("tag-fixtures-match-status-date-time");
        this.personDetailedMatchStatTeaserTournament = this.personDetailedMatchStatTeaser.getByTestId("tag-fixtures-match-status-tournament");
        this.personDetailedMatchStatTeaserHomeTeamName = this.personDetailedMatchStatTeaser.getByTestId("tag-fixtures-match-home").locator("span");
        this.personDetailedMatchStatTeaserAwayTeamName = this.personDetailedMatchStatTeaser.getByTestId("tag-fixtures-match-away").locator("span");
        this.personDetailedMatchStatTeaserHomeTeamLogo = this.personDetailedMatchStatTeaser.getByTestId("tag-fixtures-match-home-team-logo");
        this.personDetailedMatchStatTeaserAwayTeamLogo = this.personDetailedMatchStatTeaser.getByTestId("tag-fixtures-match-away-team-logo");
        this.personDetailedMatchStatTeaserScore = this.personDetailedMatchStatTeaser.getByTestId("tag-fixtures-match-score");
        this.personDetailedMatchStatMainBlock = this.personDetailedMatchStat.getByTestId("tag-person-match-stat-main-block");
        this.personDetailedMatchStatMainBlockRow = this.personDetailedMatchStatMainBlock.getByTestId("tag-person-match-stat-row");
        this.personDetailedMatchStatMainBlockRowMetricName = this.personDetailedMatchStatMainBlockRow.getByTestId("tag-person-match-stat-row-name");
        this.personDetailedMatchStatMainBlockRowMetricValue = this.personDetailedMatchStatMainBlockRow.getByTestId("tag-person-match-stat-row-value");
        this.personDetailedMatchStatLink = this.personDetailedMatchStat.getByTestId("tag-person-match-stat-link");
        this.personDetailedMatchStatAdditionalBlock = this.personDetailedMatchStat.getByTestId("tag-person-match-stat-additional-block");
        this.personDetailedMatchStatAdditionalBlockIcon = this.personDetailedMatchStatAdditionalBlock.getByTestId("tag-person-match-stat-additional-block-icon");

        this.personStatSwitcherList = this.page.getByTestId("tag-person-stat-switcher-list");
        this.personStatSwitcherMatch = this.page.getByTestId("tag-person-stat-switcher-match");

    }

    getCareerTableElements(tableLocator) {
        return {
            table: tableLocator,
            header: tableLocator.getByTestId("tag-person-career-table-header"),
            headerTeam: tableLocator.getByTestId("tag-person-career-table-header-team"),
            headerMatches: tableLocator.getByTestId("tag-person-career-table-header-matches"),
            headerGoals: tableLocator.getByTestId("tag-person-career-table-header-goals"),
            headerAssists: tableLocator.getByTestId("tag-person-career-table-header-assists"),

            totalsHeader: tableLocator.locator('[class*="__header"]:not([data-test])'),
            totalsHeaderTitle: tableLocator.locator('[class*="__header"]:not([data-test])').locator("span"),
            totalsHeaderValues: tableLocator.locator('[class*="__header"]:not([data-test])').locator('[class*="__metric_"]'),

            teamRow: tableLocator.getByTestId("tag-person-career-table-team-row"),
            teamRowTeamLogo: tableLocator.getByTestId("tag-person-career-table-team-row-team-logo"),
            teamRowTeamName: tableLocator.getByTestId("tag-person-career-table-team-row-team-name"),
            teamRowYears: tableLocator.getByTestId("tag-person-career-table-team-row-years"),
            teamRowMatches: tableLocator.getByTestId("tag-person-career-table-row-matches"),
            teamRowGoals: tableLocator.getByTestId("tag-person-career-table-row-goals"),
            teamRowAssists: tableLocator.getByTestId("tag-person-career-table-row-assists"),
            teamRowExpand: tableLocator.getByTestId("tag-person-career-table-expand"),
            teamRowCollapse: tableLocator.getByTestId("tag-person-career-table-collapse"),

            seasonRow: tableLocator.getByTestId("tag-person-career-table-season-row"),
            seasonRowSeasonBlock: tableLocator.getByTestId("tag-person-career-table-season-row-season-block"),
            seasonRowSeasonValue: tableLocator.getByTestId("tag-person-career-table-season-row-season-value"),
            seasonRowMatches: tableLocator.getByTestId("tag-person-career-table-row-matches"),
            seasonRowGoals: tableLocator.getByTestId("tag-person-career-table-row-goals"),
            seasonRowAssists: tableLocator.getByTestId("tag-person-career-table-row-assists"),
            seasonRowExpand: tableLocator.getByTestId("tag-person-career-table-expand"),
            seasonRowCollapse: tableLocator.getByTestId("tag-person-career-table-collapse"),

            tournamentRow: tableLocator.getByTestId("tag-person-career-table-tournament-row"),
            tournamentRowTournamentBlock: tableLocator.getByTestId("tag-person-career-table-tournament-row-tournament-block"),
            tournamentRowTournamentLogo: tableLocator.getByTestId("tag-person-career-table-tournament-row-tournament-logo"),
            tournamentRowTournamentName: tableLocator.getByTestId("tag-person-career-table-tournament-row-tournament-name"),
            tournamentRowMatches: tableLocator.getByTestId("tag-person-career-table-row-matches"),
            tournamentRowGoals: tableLocator.getByTestId("tag-person-career-table-row-goals"),
            tournamentRowAssists: tableLocator.getByTestId("tag-person-career-table-row-assists"),
            tournamentRowCollapse: tableLocator.getByTestId("tag-person-career-table-collapse"),
            tournamentRowExpand: tableLocator.getByTestId("tag-person-career-table-expand"),

            footer: tableLocator.getByTestId("tag-person-career-table-footer"),
            footerValues: tableLocator.getByTestId("tag-person-career-table-footer-values"),
            footerText: tableLocator.getByTestId("tag-person-career-table-footer-text")
        };
    }

    getPersonSeasonMatchListTableRow(homeTeam, awayTeam, homeGoals, awayGoals) {
        const rowCell = (testId, text) => this.page.getByTestId(testId).filter({ hasText: new RegExp(`^${text}$`) });

        return this.personSeasonMatchListTableRow
            .filter({ has: rowCell("tag-person-season-match-list-row-home-team-name", homeTeam) })
            .filter({ has: rowCell("tag-person-season-match-list-row-away-team-name", awayTeam) })
            .filter({ has: rowCell("tag-person-season-match-list-row-home-team-goals", homeGoals) })
            .filter({ has: rowCell("tag-person-season-match-list-row-away-team-goals", awayGoals) });
    }


    async checkElementIsClickable(locator) {
        await this.checkElementIsVisible(locator);

        const isEnabled = await locator.isEnabled();
        expect(isEnabled).toBe(true);
    }


    async checkElementHasVisibleChildren(parentLocator) {
        const childLocators = await parentLocator.locator('> *');

        const childCount = await childLocators.count();
        expect(childCount).toBeGreaterThan(0);

        for (let i = 0; i < childCount; i++) {
            const child = childLocators.nth(i);
            await this.checkElementIsVisible(child);
            const textContent = await child.textContent();
            expect(textContent.trim()).toBeTruthy();
        }
    }

    async checkElementHasClickableChildren(parentLocator) {
        const childLocators = await parentLocator.locator('> *');

        const childCount = await childLocators.count();
        expect(childCount).toBeGreaterThan(0);

        for (let i = 0; i < childCount; i++) {
            const child = childLocators.nth(i);
            await this.checkElementIsClickable(child);
        }
    }

    async checkTabsInTag(elements, tabs) {
        for (const text of elements) {
            const item = tabs.getByRole('link', { name: text, exact: true })

            await expect(item).toBeVisible();
        }
    }

    async personTagHeaderElementsAreVisible(expectedStatNames, bubleTextValues) {
        const tagPage = new TagPage(this.page);

        await tagPage.checkElementIsVisible(tagPage.headerContent);
        await tagPage.checkElementIsVisible(tagPage.tagLogo);
        await tagPage.checkElementIsVisible(tagPage.tagLogoAdditional);
        await tagPage.checkElementIsVisible(tagPage.tagTitle);
        await tagPage.checkElementIsVisible(tagPage.personSeasonStatLink);
        for (let i = 0; i < 3; i++) {
            await tagPage.checkElementIsVisible(tagPage.personSeasonStatName.nth(i));
            await expect(tagPage.personSeasonStatName.nth(i)).toHaveText(expectedStatNames[i]);
            await tagPage.checkElementIsVisible(tagPage.personSeasonStatValue.nth(i));
        };
        // await tagPage.checkElementIsVisible(tagPage.tagSubscribers);
        // expect(tagPage.tagSubscribers).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personNumber);
        await expect(tagPage.personNumber).toContainText(bubleTextValues[0]);
        await tagPage.checkElementIsVisible(tagPage.personTeam);
        await expect(tagPage.personTeam).toContainText(bubleTextValues[1]);
        await tagPage.checkElementIsVisible(tagPage.personPosition);
        await expect(tagPage.personPosition).toContainText(bubleTextValues[2]);
        await tagPage.checkElementIsVisible(tagPage.personAge);
        await expect(tagPage.personAge).toContainText(bubleTextValues[3]);
        await tagPage.checkElementIsVisible(tagPage.personHeight);
        await expect(tagPage.personHeight).toContainText(bubleTextValues[4]);
        if (await tagPage.personWeight.isVisible()) {
            await expect(tagPage.personWeight).toContainText(bubleTextValues[5]);
            await tagPage.checkElementIsVisible(tagPage.personNationality);
            await expect(tagPage.personNationality).toContainText(bubleTextValues[6]);
        } else {
            await tagPage.checkElementIsVisible(tagPage.personNationality);
            await expect(tagPage.personNationality).toContainText(bubleTextValues[5]);
        }

    }

    async personTagTabsAreVisible(expectedTabs, tabsCount = 5) {
        const tagPage = new TagPage(this.page);

        for (let i = 0; i < tabsCount; i++) {
            await tagPage.checkElementIsVisible(tagPage.tagHeaderTabItem.nth(i));
            await expect(tagPage.tagHeaderTabItem.nth(i)).toContainText(expectedTabs[i]);
        }
    }

    async personTagFixturesWidgetElementsAreVisible(showAllMatchesButton) {
        const tagPage = new TagPage(this.page);

        await tagPage.checkElementIsVisible(tagPage.tagFixtures);

        const matchesCount = await tagPage.tagFixturesMatchRow.count();
        expect(matchesCount).toBe(3);

        for (let i = 0; i < matchesCount; i++) {
            const match = tagPage.tagFixturesMatchRow.nth(i);
            const favButton = match.getByTestId("tag-fixtures-favorite-match-button");

            await tagPage.checkElementIsVisible(tagPage.tagFixturesMatchInfoStatus.nth(i));
            expect(tagPage.tagFixturesMatchInfoStatus.nth(i)).not.toBeNull();
            await tagPage.checkElementIsVisible(tagPage.tagFixturesMatchInfoScore.nth(i));
            await tagPage.checkElementIsVisible(tagPage.tagFixturesMatchInfoHomeTeamName.nth(i));
            expect(tagPage.tagFixturesMatchInfoHomeTeamName.nth(i)).not.toBeNull();
            await tagPage.checkElementIsVisible(tagPage.tagFixturesMatchInfoHomeTeamLogo.nth(i));
            await tagPage.checkElementIsVisible(tagPage.tagFixturesMatchInfoAwayTeamName.nth(i));
            expect(tagPage.tagFixturesMatchInfoAwayTeamName.nth(i)).not.toBeNull();
            await tagPage.checkElementIsVisible(tagPage.tagFixturesMatchInfoAwayTeamLogo.nth(i));

            if (i === 0) {
                await expect(favButton).toBeHidden();
            } else {
                await tagPage.checkElementIsVisible(favButton);
            }
        }

        await tagPage.checkElementIsVisible(tagPage.tagFixturesShowAllMatchesButton);
        await expect(tagPage.tagFixturesShowAllMatchesButton).toContainText(showAllMatchesButton);
    }

    async tagFixturesMatchTeaserRedirectsToMatch(matchIndex = 0) {
        const tagPage = new TagPage(this.page);

        const homeTeamName = (await tagPage.tagFixturesMatchInfoHomeTeamName.nth(matchIndex).textContent()).trim();
        const awayTeamName = (await tagPage.tagFixturesMatchInfoAwayTeamName.nth(matchIndex).textContent()).trim();

        await tagPage.tagFixturesMatchInfo.nth(matchIndex).click();

        // The match URL segment can be either a slug-like match hub (e.g. "crvena-zvezda-vs-radnik-surdulica")
        // or a numeric match id (e.g. "102826373") - both are valid outcomes.
        await expect(tagPage.page).toHaveURL(/match\/(?:[a-z0-9-]+|\d+)\//);

        const matchTitle = tagPage.page.getByTestId("match-title");
        await tagPage.checkElementIsVisible(matchTitle);
        await expect(matchTitle).toContainText(homeTeamName);
        await expect(matchTitle).toContainText(awayTeamName);
    }

    async personTagBiographyWidgetElementsAreVisible(expectedLabels) {
        const tagPage = new TagPage(this.page);

        await tagPage.checkElementIsVisible(tagPage.aboutPlayerWidget);

        await tagPage.checkElementIsVisible(tagPage.aboutPlayerWidgetTitle);
        for (let i = 0; i < 4; i++) {
            await tagPage.checkElementIsVisible(tagPage.aboutPlayerWidgetLabel.nth(i));
            await expect(tagPage.aboutPlayerWidgetLabel.nth(i)).toContainText(expectedLabels[i]);
        }
        await tagPage.checkElementIsVisible(tagPage.aboutPlayerWidgetValue.nth(0));
        expect(tagPage.aboutPlayerWidgetValue.nth(0)).not.toBeNull();
    }

    async tagPageFaqWidgetElementsAreVisible(numberOfFaqs) {
        const tagPage = new TagPage(this.page);

        await tagPage.checkElementIsVisible(tagPage.FAQWidgetButton);
        await tagPage.FAQWidgetButton.click();

        await tagPage.checkElementIsVisible(tagPage.FAQWidget);
        await tagPage.checkElementIsVisible(tagPage.FAQWidgetTagTitle);
        await tagPage.checkElementIsVisible(tagPage.FAQWidgetTagQuantity);
        await expect(tagPage.FAQWidgetTagQuantity).toContainText(numberOfFaqs.toString());

        await tagPage.checkElementIsVisible(tagPage.FAQWidgetTagItemHeader.first());
        expect(tagPage.FAQWidgetTagItemHeader.first()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.FAQWidgetTagItemOpenIcon);
        await tagPage.FAQWidgetTagItemOpenIcon.click();
        await tagPage.checkElementIsVisible(tagPage.FAQWidgetTagItem.locator('p').first());
        expect(tagPage.FAQWidgetTagItem.locator('p').first()).not.toBeNull();

        for (let i = 1; i < numberOfFaqs; i++) {
            await tagPage.checkElementIsVisible(tagPage.FAQWidgetTagItemCount.nth(i));
        }
    }

    async personTagLastFiveMatchesWidgetElementsAreVisible(expectedTitle, showAllMatchesButton, onTheBenchText, notInSquadText) {
        const tagPage = new TagPage(this.page);

        await tagPage.checkElementIsVisible(tagPage.lastFiveMatchesWidget);
        await tagPage.checkElementIsVisible(tagPage.lastFiveMatchesWidgetTitle);
        await expect(tagPage.lastFiveMatchesWidgetTitle).toHaveText(expectedTitle);

        await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTable);

        const matchesCount = await tagPage.personSeasonMatchListTableRow.count();
        expect(matchesCount).toBeGreaterThan(0);
        expect(matchesCount).toBeLessThanOrEqual(5);

        for (let i = 0; i < matchesCount; i++) {
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListRowResultBlock.nth(i));
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableRowTournamentLogo.nth(i));
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableRowDate.nth(i));
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableRowHomeTeamLogo.nth(i));
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableRowHomeTeamName.nth(i));
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableRowAwayTeamLogo.nth(i));
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableRowAwayTeamName.nth(i));
        }

        if (await tagPage.personSeasonMatchListTableRowOnBench.nth(0).isVisible()) {
            await expect(tagPage.personSeasonMatchListTableRowOnBench.nth(0)).toHaveText(onTheBenchText);
        } else if (await tagPage.personSeasonMatchListTableRowNotInSquad.nth(0).isVisible()) {
            await expect(tagPage.personSeasonMatchListTableRowNotInSquad.nth(0)).toHaveText(notInSquadText);
        } else {
            await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableRow.nth(0).getByTestId("tag-person-season-match-list-row-minutes"));
        }

        await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableFooter);
        await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableFooterText.nth(0));
        await tagPage.checkElementIsVisible(tagPage.personSeasonMatchListTableFooterColorIndicator.nth(0));

        await tagPage.checkElementIsVisible(tagPage.lastFiveMatchesShowAllButton);
        await expect(tagPage.lastFiveMatchesShowAllButton).toContainText(showAllMatchesButton);
    }

    async personTagCareerWidgetElementsAreVisible(expectedWidget, expectedTitleLocator, expectedTitle, expectedHeaders, expectedFooterValues, expectedFooterText, expectedTotalsTitle) {
        await this.checkElementIsVisible(expectedWidget);
        await this.checkElementIsVisible(expectedTitleLocator);
        await expect(expectedTitleLocator).toHaveText(expectedTitle);

        const careerTables = expectedWidget.getByTestId("tag-person-career-table");
        const tablesCount = await careerTables.count();

        for (let i = 0; i < tablesCount; i++) {
            const table = this.getCareerTableElements(careerTables.nth(i));

            await this.checkElementIsVisible(table.table);

            await expect(table.headerTeam).toContainText(expectedHeaders[i]);
            await this.checkElementIsVisible(table.headerMatches);
            await this.checkElementIsVisible(table.headerGoals);
            await this.checkElementIsVisible(table.headerAssists);

            // Second header with the whole career totals
            await this.checkElementIsVisible(table.totalsHeader);
            await this.checkElementIsVisible(table.totalsHeaderTitle);

            if (expectedTotalsTitle) {
                await expect(table.totalsHeaderTitle).toHaveText(expectedTotalsTitle);
            }

            for (let j = 0; j < 3; j++) {
                await this.checkElementIsVisible(table.totalsHeaderValues.nth(j));
                expect(table.totalsHeaderValues.nth(j)).not.toBeNull();
            }

            // Check first row - "Клуб"
            await this.checkElementIsVisible(table.teamRow.nth(0));
            await this.checkElementIsVisible(table.teamRowTeamLogo.nth(0));
            await this.checkElementIsVisible(table.teamRowTeamName.nth(0));
            expect(table.teamRowTeamName.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowMatches.nth(0));
            expect(table.teamRowMatches.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowGoals.nth(0));
            expect(table.teamRowGoals.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowAssists.nth(0));
            expect(table.teamRowAssists.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowExpand.nth(0));

            await table.teamRowExpand.nth(0).click();
            await this.checkElementIsVisible(table.teamRow.nth(0));

            await this.checkElementIsVisible(table.seasonRow.nth(0));
            await this.checkElementIsVisible(table.seasonRowSeasonValue.nth(0));
            expect(table.seasonRowSeasonValue.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.seasonRowMatches.nth(0));
            expect(table.seasonRowMatches.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.seasonRowGoals.nth(0));
            expect(table.seasonRowGoals.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.seasonRowAssists.nth(0));
            expect(table.seasonRowAssists.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.seasonRowExpand.nth(0));

            await table.seasonRowExpand.nth(0).click();
            await this.checkElementIsVisible(table.seasonRowCollapse.nth(0));

            await this.checkElementIsVisible(table.tournamentRow.nth(0));
            await this.checkElementIsVisible(table.tournamentRowTournamentLogo.nth(0));
            await this.checkElementIsVisible(table.tournamentRowTournamentName.nth(0));
            expect(table.tournamentRowTournamentName.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.tournamentRowMatches.nth(0));
            expect(table.tournamentRowMatches.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.tournamentRowGoals.nth(0));
            expect(table.tournamentRowGoals.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.tournamentRowAssists.nth(0));
            expect(table.tournamentRowAssists.nth(0)).not.toBeNull();

            for (let j = 0; j < 3; j++) {
                await this.checkElementIsVisible(table.footerValues.nth(j));
                await expect(table.footerValues.nth(j)).toHaveText(expectedFooterValues[j]);
                await this.checkElementIsVisible(table.footerText.nth(j));
                await expect(table.footerText.nth(j)).toHaveText(expectedFooterText[j]);
            }
        }
    }

    // Посилання у віджетах із таблицями tag-person-career-table: clubs - перша таблиця (клубна), nationalTeams - друга (збірні).
    // Ключі кожної таблиці: teams (логотип і назва команди), tournaments (логотип і назва турніру), seasons (значення сезону).
    // Вкладені рядки є в DOM і тоді, коли батьківський рядок згорнутий, тому нічого не розгортаємо
    async checkPersonCareerTablesLinks(widget, { clubs, nationalTeams }) {
        await this.checkElementIsVisible(widget);

        const careerTables = widget.getByTestId("tag-person-career-table");
        await expect(careerTables).toHaveCount(2);

        for (const [i, links] of [clubs, nationalTeams].entries()) {
            const table = this.getCareerTableElements(careerTables.nth(i));

            await this.checkLinkPaths({
                teams: [table.teamRowTeamLogo, table.teamRowTeamName],
                tournaments: [table.tournamentRowTournamentLogo, table.tournamentRowTournamentName],
                seasons: table.seasonRowSeasonValue,
            }, links);
        }
    }

    // "Карьера игрока": клуб -> сезон -> турнір; сезони посилань не мають, тому ключа seasons тут не передаємо
    async checkPersonCareerWidgetLinks(links) {
        await this.checkPersonCareerTablesLinks(this.careerWidget, links);
    }

    // "Результаты игрока в турнире": турнір -> команда -> сезон
    async checkPersonTournamentResultsWidgetLinks(links) {
        await this.checkPersonCareerTablesLinks(this.playerTournamentResultsWidget, links);
    }

    async personTagTournamentResultsWidgetElementsAreVisible(expectedWidget, expectedTitleLocator, expectedTitle, expectedHeaders, expectedFooterValues, expectedFooterText, expectedTotalsTitle) {
        await this.checkElementIsVisible(expectedWidget);
        await this.checkElementIsVisible(expectedTitleLocator);
        await expect(expectedTitleLocator).toHaveText(expectedTitle);

        const careerTables = expectedWidget.getByTestId("tag-person-career-table");
        const tablesCount = await careerTables.count();

        for (let i = 0; i < tablesCount; i++) {
            const table = this.getCareerTableElements(careerTables.nth(i));

            await this.checkElementIsVisible(table.table);

            await expect(table.headerTeam).toContainText(expectedHeaders);
            await this.checkElementIsVisible(table.headerMatches);
            await this.checkElementIsVisible(table.headerGoals);
            await this.checkElementIsVisible(table.headerAssists);

            // Second header with the whole career totals
            await this.checkElementIsVisible(table.totalsHeader);
            await this.checkElementIsVisible(table.totalsHeaderTitle);

            if (expectedTotalsTitle) {
                await expect(table.totalsHeaderTitle).toHaveText(expectedTotalsTitle);
            }

            for (let j = 0; j < 3; j++) {
                await this.checkElementIsVisible(table.totalsHeaderValues.nth(j));
                expect(table.totalsHeaderValues.nth(j)).not.toBeNull();
            }

            // Level 1: "Турнір" (Tournament Row)
            await this.checkElementIsVisible(table.tournamentRow.nth(0));
            await this.checkElementIsVisible(table.tournamentRowTournamentLogo.nth(0));
            await this.checkElementIsVisible(table.tournamentRowTournamentName.nth(0));
            expect(table.tournamentRowTournamentName.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.tournamentRowMatches.nth(0));
            expect(table.tournamentRowMatches.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.tournamentRowGoals.nth(0));
            expect(table.tournamentRowGoals.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.tournamentRowAssists.nth(0));
            expect(table.tournamentRowAssists.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.tournamentRowExpand.nth(0));

            await table.tournamentRowExpand.nth(0).click();
            await this.checkElementIsVisible(table.tournamentRowCollapse.nth(0));

            // Level 2: "Клуб" (Team Row)
            await this.checkElementIsVisible(table.teamRow.nth(0));
            await this.checkElementIsVisible(table.teamRowTeamLogo.nth(0));
            await this.checkElementIsVisible(table.teamRowTeamName.nth(0));
            expect(table.teamRowTeamName.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowMatches.nth(0));
            expect(table.teamRowMatches.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowGoals.nth(0));
            expect(table.teamRowGoals.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowAssists.nth(0));
            expect(table.teamRowAssists.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.teamRowExpand.nth(0));

            await table.teamRowExpand.nth(0).click();
            await this.checkElementIsVisible(table.teamRowCollapse.nth(0));

            // Level 3: "Сезон" (Season Row)
            await this.checkElementIsVisible(table.seasonRow.nth(0));
            await this.checkElementIsVisible(table.seasonRowSeasonValue.nth(0));
            expect(table.seasonRowSeasonValue.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.seasonRowMatches.nth(0));
            expect(table.seasonRowMatches.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.seasonRowGoals.nth(0));
            expect(table.seasonRowGoals.nth(0)).not.toBeNull();
            await this.checkElementIsVisible(table.seasonRowAssists.nth(0));
            expect(table.seasonRowAssists.nth(0)).not.toBeNull();

            for (let j = 0; j < 3; j++) {
                await this.checkElementIsVisible(table.footerValues.nth(j));
                await expect(table.footerValues.nth(j)).toHaveText(expectedFooterValues[j]);
                await this.checkElementIsVisible(table.footerText.nth(j));
                await expect(table.footerText.nth(j)).toHaveText(expectedFooterText[j]);
            }
        }
    }

    // Посилання у віджеті "Трансферная история": увесь рядок - одне посилання на клуб, у який перейшов гравець,
    // тому логотип, назва, дата, статус і сума ведуть туди ж.
    // Ключі: transfers (логотип, назва, дата, статус - є в кожному рядку), prices (сума - лише там, де вона вказана)
    async checkPersonTransferHistoryWidgetLinks(links) {
        await this.checkElementIsVisible(this.personTransferHistoryWidget);
        await this.checkLinkPaths({
            transfers: [this.personTransferHistoryTeamLogo, this.personTransferHistoryTeamName, this.personTransferHistoryDate, this.personTransferHistoryStatus],
            prices: this.personTransferHistorySum,
        }, links);
    }

    // Посилання у віджеті "Трофеи игрока". Ключі: teams (логотип і назва команди), tournaments (назва турніру в рядку трофею).
    // Рядки трофеїв з'являються в DOM лише після розгортання команди, тому спочатку розгортаємо всі команди;
    // сезони й кількість трофеїв посилань не мають
    async checkPersonTrophiesWidgetLinks({ teams, tournaments }) {
        await this.checkElementIsVisible(this.personTrophiesWidget);
        await this.checkLinkPaths({ teams: [this.personTrophiesWidgetTableTeamRowLogo, this.personTrophiesWidgetTableTeamRowName] }, { teams });

        const expandButtons = this.personTrophiesWidgetTableTeamRowExpandButton;
        const teamsCount = await expandButtons.count();

        for (let i = 0; i < teamsCount; i++) {
            await expandButtons.nth(i).click();
            await expect(expandButtons.nth(i)).toHaveAttribute("aria-expanded", "true");
        }

        await this.checkLinkPaths({ tournaments: this.personTrophiesWidgetTableTrophyRowTournament }, { tournaments });
    }

    async personTagTransferHistoryWidgetElementsAreVisible(expectedTitle) {
        await this.checkElementIsVisible(this.personTransferHistoryWidget);
        await this.checkElementIsVisible(this.personTransferHistoryWidgetTitle);
        await expect(this.personTransferHistoryWidgetTitle).toHaveText(expectedTitle);

        const rowsCount = await this.personTransferHistoryRow.count();
        expect(rowsCount).toBeGreaterThan(0);

        for (let i = 0; i < rowsCount; i++) {
            await this.checkElementIsVisible(this.personTransferHistoryTeamLogo.nth(i));
            await this.checkElementIsVisible(this.personTransferHistoryTeamName.nth(i));
            expect(await this.personTransferHistoryTeamName.nth(i).textContent()).not.toBeNull();
            await this.checkElementIsVisible(this.personTransferHistoryDate.nth(i));
            expect(await this.personTransferHistoryDate.nth(i).textContent()).not.toBeNull();
            await this.checkElementIsVisible(this.personTransferHistoryStatus.nth(i));
            expect(await this.personTransferHistoryStatus.nth(i).textContent()).not.toBeNull();

            if (await this.personTransferHistorySum.nth(i).isVisible()) {
                expect(await this.personTransferHistorySum.nth(i).textContent()).not.toBeNull();
            }
        }
    }

    async personTagTrophiesWidgetElementsAreVisible(expectedTitle, expectedHeaderTeam, expectedHeaderTrophy, expectedFooterLabel, expectedFooterLegend) {
        const tagPage = new TagPage(this.page);

        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidget);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTitle);
        await expect(tagPage.personTrophiesWidgetTitle).toHaveText(expectedTitle);

        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTable);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableHeader);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableHeaderTeam);
        await expect(tagPage.personTrophiesWidgetTableHeaderTeam).toHaveText(expectedHeaderTeam);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableHeaderTrophy);
        await expect(tagPage.personTrophiesWidgetTableHeaderTrophy).toHaveText(expectedHeaderTrophy);

        const teamRow = tagPage.personTrophiesWidgetTableTeamRow.first();
        await tagPage.checkElementIsVisible(teamRow);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTeamRowExpandButton.first());
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTeamRowExpanderClose.first());
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTeamRowLogo.first());
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTeamRowName.first());
        expect(await tagPage.personTrophiesWidgetTableTeamRowName.first().textContent()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableRowTrophy.first());
        expect(await tagPage.personTrophiesWidgetTableRowTrophy.first().textContent()).not.toBeNull();

        await tagPage.personTrophiesWidgetTableTeamRowExpandButton.first().click();
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTeamRowExpanderOpen.first());

        const trophyRow = tagPage.personTrophiesWidgetTableTrophyRow.first();
        await tagPage.checkElementIsVisible(trophyRow);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTrophyRowTournament.first());
        expect(await tagPage.personTrophiesWidgetTableTrophyRowTournament.first().textContent()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTrophyRowSeason.first());
        expect(await tagPage.personTrophiesWidgetTableTrophyRowSeason.first().textContent()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableTrophyRowTrophies.first());
        expect(await tagPage.personTrophiesWidgetTableTrophyRowTrophies.first().textContent()).not.toBeNull();

        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableFooter);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableFooterText);
        await expect(tagPage.personTrophiesWidgetTableFooterText).toContainText(expectedFooterLabel);
        await tagPage.checkElementIsVisible(tagPage.personTrophiesWidgetTableFooterLegend);
        await expect(tagPage.personTrophiesWidgetTableFooterLegend).toHaveText(expectedFooterLegend);
    }

    // Посилання у віджеті "История травм". Ключ: clubs (логотип клубу в рядку травми).
    // Назва травми, дати, пропущені дні й матчі посилань не мають
    async checkPersonInjuryHistoryWidgetLinks(links) {
        await this.checkElementIsVisible(this.personInjuryHistoryWidget);
        await this.checkLinkPaths({ clubs: this.personInjuryHistoryWidgetTableRowClubLogo }, links);
    }

    async personTagInjuryHistoryWidgetElementsAreVisible(expectedTitle, expectedHeaders, expectedFooterValues, expectedFooterText) {
        const tagPage = new TagPage(this.page);

        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidget);
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTitle);
        await expect(tagPage.personInjuryHistoryWidgetTitle).toHaveText(expectedTitle);
        expect(await tagPage.personInjuryHistoryWidgetTitle.evaluate((el) => el.tagName)).toBe("H2");

        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTable);
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableHeader);
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableHeaderInjury);
        await expect(tagPage.personInjuryHistoryWidgetTableHeaderInjury).toHaveText(expectedHeaders[0]);
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableHeaderDaysMissed);
        await expect(tagPage.personInjuryHistoryWidgetTableHeaderDaysMissed).toHaveText(expectedHeaders[1]);
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableHeaderMatchesMissed);
        await expect(tagPage.personInjuryHistoryWidgetTableHeaderMatchesMissed).toHaveText(expectedHeaders[2]);
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableHeaderClub);
        await expect(tagPage.personInjuryHistoryWidgetTableHeaderClub).toHaveText(expectedHeaders[3]);

        const row = tagPage.personInjuryHistoryWidgetTableRow.first();
        await tagPage.checkElementIsVisible(row);
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableRowInjuryName.first());
        expect(await tagPage.personInjuryHistoryWidgetTableRowInjuryName.first().textContent()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableRowInjuryDate.first());
        expect(await tagPage.personInjuryHistoryWidgetTableRowInjuryDate.first().textContent()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableRowDaysMissed.first());
        expect(await tagPage.personInjuryHistoryWidgetTableRowDaysMissed.first().textContent()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableRowMatchesMissed.first());
        expect(await tagPage.personInjuryHistoryWidgetTableRowMatchesMissed.first().textContent()).not.toBeNull();
        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableRowClubLogo.first());

        await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableFooter);
        for (let i = 0; i < 3; i++) {
            await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableFooterValues.nth(i));
            await expect(tagPage.personInjuryHistoryWidgetTableFooterValues.nth(i)).toHaveText(expectedFooterValues[i]);
            await tagPage.checkElementIsVisible(tagPage.personInjuryHistoryWidgetTableFooterText.nth(i));
            await expect(tagPage.personInjuryHistoryWidgetTableFooterText.nth(i)).toHaveText(expectedFooterText[i]);
        }
    }
}

export async function runTestViaLocales(page, locale, BASE_URL, urlPart, callback, ...callbackArgs) {
    for (const lang of locale) {
        if (BASE_URL.includes("ua")) {
            if (lang === "uk") {
                await page.context().clearCookies();
                await page.goto(BASE_URL + `${lang}/` + `football/${urlPart}/`);
                await callback(page, lang, ...callbackArgs);
            } else if (lang === "ru") {
                await page.context().clearCookies();
                await page.goto(BASE_URL + `football/${urlPart}/`);
                await callback(page, lang, ...callbackArgs);
            }
        } else if (BASE_URL.includes("by")) {
            if (lang === "be") {
                await page.context().clearCookies();
                await page.goto(BASE_URL + `${lang}/` + `football/${urlPart}/`);
                await callback(page, lang, ...callbackArgs);
            } else if (lang === "ru") {
                await page.context().clearCookies();
                await page.goto(BASE_URL + `football/${urlPart}/`);
                await callback(page, lang, ...callbackArgs);
            }
        } else {
            if (lang !== "uk" && lang !== "be" && lang !== "ru") {
                await page.goto(BASE_URL + `${lang}/` + `${urlPart}/`);
                await callback(page, lang, ...callbackArgs);
            }
        }
    }
}

export async function seoTextIsVisible(page, locale, seoTextObject) {

    const tagPage = new TagPage(page);

    await tagPage.checkElementIsVisible(tagPage.seoTextWidget);
    await expect.soft(tagPage.seoTextWidget).toContainText(seoTextObject[locale]);
}