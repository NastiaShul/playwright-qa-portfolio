# Example Usage: Playwright Test Self-Healing

This document demonstrates a complete execution flow of the `playwright-self-healing` skill by the AI agent.

## Scenario
A UI regression test failed after a recent deployment. The user asks the agent to investigate the failure, find the root cause, and heal the test without breaking the Page Object Model (POM) architecture.

---

## Interaction Log

**User:** "Agent, the test `tests/uiRegression/auth/login.spec.js` is failing in the CI. Please use the self-healing skill to investigate and fix it."

**Agent [Thought Process & Execution]:**

### 1. Reproduce and Analyze
*Action:* Run the failing test locally to get the stack trace, exact error, and generate artifacts.
*Command:* `SKIP_GLOBAL_SETUP=true BASE_URL=https://stage.ua.example.com/ npx playwright test tests/uiRegression/auth/login.spec.js --project=chromium --retries=0 --reporter=list`
*Output:*
```text
1) [chromium] › tests/uiRegression/auth/login.spec.js:12:5 › Login Flow › should log in successfully
Error: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#login-submit-btn')
...
    at LoginPage.submitLogin (/pages/login.page.js:24:35)
```
*Analysis:* The failure occurs inside the `LoginPage` object (`pages/login.page.js` at line 24). The test timed out waiting for the selector `#login-submit-btn`.

### 2. Inspect Failure Artifacts
*Action:* Before opening the browser, check the `test-results/` directory for screenshots or traces to understand the visual state at the moment of failure.
*Command:* `ls -la test-results/auth-login-chromium/`
*Output:* `test-failed-1.png`
*Analysis:* Viewing `test-failed-1.png` confirms the login page is fully loaded and a submit button is visually present on the screen. This indicates the element exists, but its DOM attributes have likely changed, causing the strict `#login-submit-btn` selector to fail.

### 3. Inspect Live Application State
*Action:* Use browser MCP tools to recreate the state and inspect the current DOM of the button we saw in the screenshot.
*Tool Call:* `mcp_playwright_browser_navigate({ url: '/login' })`
*Tool Call:* `mcp_playwright_browser_evaluate({ script: "document.querySelector('form.login-form').innerHTML" })`
*Result:* The returned DOM snippet shows the button has been modified by the development team:
`<button type="submit" class="btn btn-primary" data-testid="auth-login-button">Sign In</button>`

### 4. Identify the Root Cause
*Conclusion:* The ID `#login-submit-btn` was removed. However, a stable `data-testid` attribute (`auth-login-button`) was added. This is a locator change (DOM update), not a functional application bug. The test needs to be healed.

### 5. Implement the Fix
*Action:* Update the Page Object Model to use the new, preferred locator (`getByTestId`).

*File:* `pages/login.page.js`
**Modifications:**
```javascript
// BEFORE
class LoginPage {
    constructor(page) {
        this.page = page;
        // Brittle selector that broke
        this.submitBtn = page.locator('#login-submit-btn'); 
    }
}

// AFTER
class LoginPage {
    constructor(page) {
        this.page = page;
        // Healed selector using Playwright best practices
        this.submitBtn = page.getByTestId('auth-login-button'); 
    }
}
```
*Note:* The spec file (`login.spec.js`) remains untouched, maintaining the strict separation of concerns required by the POM structure.

### 6. Verify the Fix
*Action:* Re-run the test to ensure the applied fix works and no other steps are broken.
*Command:* `SKIP_GLOBAL_SETUP=true BASE_URL=https://stage.ua.example.com/ npx playwright test tests/uiRegression/auth/login.spec.js --project=chromium --retries=0 --reporter=list`
*Output:*
```text
✓  [chromium] › tests/uiRegression/auth/login.spec.js:12:5 › Login Flow › should log in successfully (2.1s)
1 passed (2.1s)
```

---

## Final Output to User
**Agent:** "I have successfully healed the test. 

**Root Cause:** The `id` attribute `#login-submit-btn` was removed from the submit button in the latest build. Visual inspection of the test artifacts confirmed the button was still rendering on the page.
**Fix:** I noticed a new `data-testid="auth-login-button"` was added to the DOM element. I updated the `submitBtn` locator in `pages/login.page.js` to use `page.getByTestId()`. 
**Status:** The spec file ran successfully and passed. No changes to the test logic were needed."