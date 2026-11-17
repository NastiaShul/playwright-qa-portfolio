---
name: jira-qa-workflow
description: Execute requirements generation, code review analysis, QA test case alignment, and Playwright test automation sequentially for a selected Jira ticket.
---

# Jira QA Workflow Orchestrator Skill

This skill automates the full QA lifecycle for a selected Jira ticket by chaining together four specialized agent skills:
1. **`jira-to-md`**: Extract requirements/acceptance criteria and generate local Markdown test cases.
2. **`jira-mr-code-analyst`**: Analyze GitLab MR code diffs and generate a code review report.
3. **`qa-review-test-aligner`**: Align the code changes with the test cases and generate an alignment report.
4. **`md-to-playwright`**: Convert the updated/aligned test cases into verified Playwright automated tests.

---

## Prerequisites
Before executing this workflow, ensure that:
- The Atlassian Jira, GitLab, and Playwright MCP servers are running and configured.
- The workspace root contains the `test-cases/`, `ai-report/`, `pages/`, and `tests/` directories.

---

## Workflow Steps

### Step 1: Extract Jira Requirements (`jira-to-md`)
- Ask the user for the Jira issue key (e.g. `PROJ-123`).
- Fetch the Jira issue summary, description, and comments.
- Determine the target platform (e.g., `web`, `admin`) and target directory under `test-cases/`.
- Parse the requirements and generate initial markdown test case file(s) named `test-cases/[platform]/[JiraKey]-[title].md`.
- Ensure the frontmatter is correctly populated with `refs: "[JiraKey]"`.

### Step 2: Analyze Code Changes (`jira-mr-code-analyst`)
- Fetch the main Jira ticket and all of its sub-tasks.
- Retrieve remote links to find linked GitLab Merge Requests (MRs).
- Fetch the details and code diffs for all linked MRs.
- Analyze frontend updates, backend API changes, and regression risks.
- Save the report to `ai-report/[JiraKey]-report.md`. Ensure the **Agent-Parsable Change Spec** section is strictly populated with structured YAML/JSON data (including `changed_apis`, `ui_changes` with selectors, etc.).

### Step 3: Align Test Cases with Implementation (`qa-review-test-aligner`)
- Read the code review report `ai-report/[JiraKey]-report.md`.
- Search the `test-cases/` directory for all markdown files matching the Jira key (`refs: "[JiraKey]"`).
- Compare the implemented code changes with the test cases to identify:
  - Coverage gaps (new features/endpoints/configurations).
  - Selector/element mismatches.
  - Logic contradictions or implementation bugs.
  - Edge cases and regression zones.
- Generate and save the QA alignment report to `ai-report/[JiraKey]-qa-alignment.md` (containing diffs for test case updates or new test case blueprints).

### Step 4: Apply Suggested Test Case Updates
- Apply the suggested diffs or updates from the alignment report back to the local markdown test cases.
- If a new test case blueprint was suggested, create the new markdown test case file under the appropriate directory and set its `refs` to `"[JiraKey]"`.

### Step 5: Automate Tests with Playwright (`md-to-playwright`)
- Locate the markdown test case(s) for the Jira ticket.
- Execute the modified `md-to-playwright` skill:
  - The skill will detect the `refs` (Jira key) in the test case frontmatter.
  - It will load `ai-report/[JiraKey]-report.md` and `ai-report/[JiraKey]-qa-alignment.md` to extract the exact selectors, API endpoints, and edge cases.
  - Map steps to Page Objects or create new ones using the exact selectors from the PR.
  - Generate the spec file in `tests/uiRegression/`.
  - Run the test using Playwright CLI and iterate/fix if any failures occur.
