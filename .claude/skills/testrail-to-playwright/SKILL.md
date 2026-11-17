---
name: testrail-to-playwright
description: Retrieve test case from TestRail, generate Playwright JS test, and verify locators.
---

# TestRail to Playwright Skill

This skill guides you through the process of converting a TestRail test case into a Playwright JavaScript test following the project's Page Object Model (POM) structure.

## Steps

### 1. Fetch Test Case from TestRail
- Use `mcp_testrail_getCase` with the provided `caseId`.
- Extract `title`, `custom_steps`, and `custom_expected`.

### 2. Analyze Requirements
- Identify the target page(s) for the test.
- Check existing Page Objects in `pages/` directory.
- Map test steps to existing Page Object methods or identify new ones needed.

### 3. Discover Selectors
- If new locators are needed, use `mcp_playwright_browser_navigate` to go to the relevant URL.
- Use `mcp_playwright_browser_snapshot` or `mcp_playwright_browser_evaluate` to find stable selectors (prioritize `data-test` or `data-testid`).

### 4. Create/Update Page Objects
- If new methods or locators are required, update the corresponding file in `pages/`.
- Maintain the class-based structure and follow existing patterns.

### 5. Generate Playwright Test
- Create a new spec file in `tests/uiRegression/[category]/`.
- Follow the project's test structure:
    - Import `test` and `expect` from `@playwright/test`.
    - Import relevant Page Objects.
    - Use `test.describe` and `test` blocks.
    - Implement `beforeEach` for setup (e.g., `page.goto`, consent acceptance).

### 6. Verify and Fix
- Run the generated test using `npx playwright test [path_to_spec] --project=chromium --retries=0 --reporter=list`.
- If the test fails due to locator issues, use the browser tool to debug and refine locators.
- Iterate until the test passes.

## Best Practices
- Use `data-test` attributes whenever possible.
- Keep tests concise and readable.
- Reuse existing logic from Page Objects.
- Ensure proper cleanup or state management in `afterEach` if necessary.
