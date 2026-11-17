# Example Usage: TestRail to Playwright

This example demonstrates how to use the `testrail-to-playwright` skill.

## 1. Trigger the Skill
**User**: "Agent, use the testrail-to-playwright skill to automate Case ID 10631."

## 2. Skill Execution by Agent

### Step 1: Fetch Case Details
The agent calls `mcp_testrail_getCase(caseId: 10631)`.
**Output**:
- Title: "Check Burger Menu Links"
- Steps:
    1. Navigate to main page.
    2. Click on burger menu.
    3. Verify links (News, Blogs, etc.) are visible.

### Step 2: Analyze and Discover
The agent analyzes `pages/main.page.js` and identifies `MainPage` class with `clickOnBurgerMenu` and `checkElementsInMenu` methods.

### Step 3: Generate Code
The agent creates `tests/uiRegression/mainPage/burgerMenu.spec.js`:

```javascript
import { test } from "@playwright/test";
import { MainPage } from "../../../pages/main.page";

test.describe("Burger Menu Verification", () => {
    test("Check menu links visibility", async ({ page }) => {
        const mainPage = new MainPage(page);
        await page.goto("/");
        await mainPage.acceptConsent();
        await mainPage.clickOnBurgerMenu();
        await mainPage.checkElementsInMenu(["News", "Blogs", "Match Center"]);
    });
});
```

### Step 4: Verify
The agent runs:
`npx playwright test tests/uiRegression/mainPage/burgerMenu.spec.js`

If it fails because "Match Center" is actually "Matches", the agent fixes the code and reruns.
