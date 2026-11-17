import { test, expect } from '@playwright/test';
import { MatchCenterPage } from '../../../pages/match-center.page';
import { authState } from "../../../src/utils/uiAuthHelper";

test.use({ userAgent: "UIAutotest" });

const BASE_URL = process.env.BASE_URL;

test.describe.configure({ retries: 2 });

test.describe('Match Center Display Tests', () => {
    let matchCenterPage;

    test.beforeEach(async ({ context, page, isMobile }) => {
        matchCenterPage = new MatchCenterPage(page);

        await authState(context, isMobile ? "user2" : "user");

        const urlPart = BASE_URL.includes("ua") || BASE_URL.includes("by") ? "football/match/" : "de/match/";
        const onboardingData = {
            time: Date.now(),
            data: { maxShows: 1, shownCount: 1 }
        };

        const favoriteMatchModalData = {
            "time": Date.now(),
            "data": {
                "count": 1,
                "isDisabled": true
            }
        }

        await context.addInitScript((data) => {
            localStorage.setItem("subsOnboarding", JSON.stringify(data));
        }, onboardingData);

        await context.addInitScript((data) => {
            localStorage.setItem("favorite_match_modal", JSON.stringify(data));
        }, favoriteMatchModalData);

        await page.addInitScript(() => {
            sessionStorage.setItem('webToAppShown', 'true');
        });

        await page.goto(BASE_URL + urlPart);
        await matchCenterPage.acceptConsent();
    });

    test('Check match center page elements are visible', async ({ page }) => {
        const favoriteIdsLoaded =
            matchCenterPage.waitForGraphqlResponse("getUserFavoriteMatchesIdsByDate");
        await favoriteIdsLoaded;

        await expect(matchCenterPage.matchListContainer).toBeVisible();

        await matchCenterPage.addMatchToFavourite();

    });
});