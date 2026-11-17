---
name: playwright-self-healing
description: Analyze failing Playwright test, identify the root cause (e.g., broken locators, timing issues), find a fix using browser tools, and verify the solution. Fix broken Playwright tests, heal locators, analyze failing test cases and verify the solution.

---

# Playwright Self-Healing Skill

This skill guides you through the process of investigating a failing Playwright JavaScript test, identifying the reason for the failure, fixing the code (updating locators or logic in the Page Object Model), and verifying the fix.

## Project Structure & Artifacts
When a test fails, Playwright generates artifacts. You should use them to understand the failure before trying to reproduce it blindly:
- **`playwright-report/`**: Contains the HTML report.
- **`test-results/`**: Contains artifacts for specific test runs, including:
  - `*.png` (Screenshots at the moment of failure)
  - `trace.zip` (DOM snapshots, network requests, and console logs)
- **`pages/`**: Contains Page Object Model files.
- **`tests/`**: Contains the actual test specifications (`.spec.js`).

## Steps

### 1. Reproduce and Analyze the Failure
- Run the failing test using the project's required environment variables. ALWAYS use this command format:
  `SKIP_GLOBAL_SETUP=true BASE_URL=https://stage.ua.example.com/ npx playwright test [path_to_spec] --project=chromium --retries=0 --reporter=list`
- **CRITICAL EXECUTION RULE:** You MUST use the EXACT command format above. DO NOT use `npm run test`, `yarn test`, or any scripts from `package.json`. You MUST include the environment variables.
- Analyze the error output and stack trace.
- **CRITICAL STOP:** If the error is related to infrastructure, setup (`global-setup.js`), API/GraphQL responses (e.g., 400/500 errors), or syntax issues, **DO NOT proceed to Step 2**. Stop the execution immediately and report the setup issue to the user. Proceed to Step 2 ONLY if it's a clear UI/locator failure (e.g., Timeout waiting for selector, assertion failed).

### 2. Inspect Artifacts and Application State
- Before re-running or navigating blindly, check if there are failure artifacts in the `test-results/` directory (e.g., screenshots).
- If your environment supports image analysis, view the failure screenshot to understand the visual state.
- If the screenshot isn't enough, read the test code and relevant Page Object files to understand the intended flow.
- **CRITICAL - Replicate the Exact State:** If you use `mcp_playwright_browser_navigate`, simply going to the initial URL is NOT enough. You MUST perform the necessary UI interactions (e.g., clicking buttons to open modals, navigating menus) to reach the *exact* UI state where the failure occurred. Read the test steps to know what to click before searching for the broken locator.
- Once in the correct state, use `mcp_playwright_browser_evaluate` or snapshot tools to inspect the live DOM.

### 3. Identify the Root Cause
- Compare the expected selector/state in the code with the actual DOM snapshot.
- Check if the element's attributes (id, class, text) have changed.
- Check if it's a synchronization/timing issue (element takes longer to appear or needs a specific state).
- **Crucial:** Determine if this is a broken test that needs fixing, or a legitimate bug in the application (e.g., element is completely missing, 500 error).


### 4. Implement the Fix
- If a locator has changed, find a new, stable selector in the DOM (prioritize `data-test` or `data-testid`, then stable text or accessibility roles).
- Update the corresponding Page Object file in the `pages/` directory. Do not hardcode locators in the spec file if they belong in a POM.
- If it's a timing issue, add appropriate Playwright waits (e.g., `waitForSelector`, `waitForLoadState`, or assert on state) rather than hardcoded timeouts.

### 5. Verify the Fix
- Re-run the test using `npx playwright test [path_to_spec] --project=chromium --retries=0 --reporter=list`.
- If the test still fails, repeat the analysis and DOM inspection steps. Iterate until the test passes.

## Best Practices
- **Do not ignore assertions:** Never remove an assertion just to make a test pass. Fix the underlying issue.
- **Maintain POM:** Always update locators in the Page Object class, not directly in the `.spec.js` file (unless it's a spec-specific element).
- **Stable Selectors:** Avoid brittle CSS selectors (e.g., `div > span:nth-child(3)`). Use semantic locators or data attributes.
- **Report Real Bugs:** If the test failure is due to an actual application bug, halt the self-healing process and report the bug instead of trying to hack the test to pass.
- **NO TEMP SCRIPTS:** DO NOT write, generate, or execute any custom Node.js debugging scripts (e.g., `temp.js`, `debug.js`) to inspect the DOM or run Playwright. You MUST exclusively use the provided `mcp_playwright_*` tools for all browser interactions and state inspections.