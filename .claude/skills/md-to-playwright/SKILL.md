---
name: md-to-playwright
description: Convert markdown test case to Playwright JS test, discover locators and generate Page Objects.
---

# MD to Playwright Skill

This skill guides you through the process of converting a markdown test case into a Playwright JavaScript test following the project's Page Object Model (POM) structure.

## Steps

### 1. Analyze Test Case from MD File
- Use md files from test-cases directory with provided id.
- Extract the Jira key from the `refs` field in the frontmatter (e.g., `refs: "PROJ-123"`).

### 2. Check for Local Jira/MR Reports
- If a Jira key is found, check if `ai-report/[JiraKey]-report.md` or `ai-report/[JiraKey]-qa-alignment.md` exists in the workspace.
- If found, read these reports and extract:
  - **Selectors & UI changes** (from the `ui_changes` section or `Agent-Parsable Change Spec` block).
  - **API queries, mutation endpoints, payload fields, and response schemas** (from the `changed_apis` section).
  - **Edge cases, negative scenarios, and regression risk zones** (from the recommendations).

### 3. Analyze Requirements
- Identify the target page(s) for the test.
- Check existing Page Objects in `pages/` directory.
- Map test steps to existing Page Object methods or identify new ones needed.

### 4. Discover Selectors
- Prioritize using the exact selectors added/modified in the pull request (extracted in Step 2 from the reports).
- If new locators are still needed or not specified in the reports, use `mcp_playwright_browser_navigate` to go to the relevant URL.
- Use `mcp_playwright_browser_snapshot` or `mcp_playwright_browser_evaluate` to find stable selectors (prioritize `data-test` or `data-testid`).

### 5. Create/Update Page Objects
- If new methods or locators are required, update the corresponding file in `pages/`.
- Use the selector names and behaviors identified in Step 2 and Step 4.
- Maintain the class-based structure and follow existing patterns.

### 6. Generate Playwright Test
- Create a new spec file in `tests/uiRegression/[category]/`.
- Incorporate not only the basic test case steps but also the edge cases and regression scenarios suggested in `ai-report/[JiraKey]-qa-alignment.md` or `ai-report/[JiraKey]-report.md`.
- Follow the project's test structure:
    - Import `test` and `expect` from `@playwright/test`.
    - Import relevant Page Objects.
    - Use `test.describe` and `test` blocks.
    - Implement `beforeEach` for setup (e.g., `page.goto`, consent acceptance).

### 7. Verify and Fix
- Run the generated test using `npx playwright test [path_to_spec] --project=chromium --retries=0 --reporter=list`.
- If the test fails due to locator issues, use the browser tool to debug and refine locators.
- Iterate until the test passes.

## Best Practices
- Use `data-test` attributes whenever possible.
- Prioritize static analysis from MR reports to minimize browser locator scanning time.
- Keep tests concise and readable.
- Reuse existing logic from Page Objects.
- Ensure proper cleanup or state management in `afterEach` if necessary.
