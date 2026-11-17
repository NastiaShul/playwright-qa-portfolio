---
name: QA Code Review and Test Case Aligner
description: Take a Jira ticket key, locate the local AI code review report and matching test cases, analyze differences/gaps/potential bugs, and generate a comprehensive QA alignment report.
---

# QA Code Review and Test Case Aligner Skill

This skill guides the AI agent through the process of aligning local code review reports with existing markdown test cases for a given Jira ticket key. By comparing actual implementation details (from the code review report) with intended test scenarios (from test cases), you will identify gaps, update test cases, recommend targeted testing areas, and find implementation bugs to assist QA engineers.

---

## Steps

### 1. Identify and Parse Jira Key
- Request the Jira key (e.g., `PROJ-123`) from the user or context.
- Keep the format normalized (e.g., matching the prefix and numeric part, e.g., `PROJ-123`).

### 2. Locate and Read the Local Code Review Report
- Look for the code review report file in the `ai-report/` directory of the workspace.
- The standard report name is `ai-report/[JiraKey]-report.md` (e.g., `ai-report/PROJ-123-report.md`).
- If not found there, check if there is an `ai-reports/` folder, or search the entire workspace for a file containing `[JiraKey]-report.md`.
- Read the content of the code review report. Make sure to parse:
  - The changed files and components.
  - The API modifications (endpoints, methods, payload, and response).
  - The UI changes (selectors added/removed, pages, behavioral notes).
  - The direct scenarios and regression risks listed.
  - The `Agent-Parsable Change Spec` section (if it exists) to get exact technical specs.

### 3. Locate and Read Matching Test Cases
- Search the `test-cases/` directory recursively for any markdown (`.md`) files that match the Jira key.
- A file matches if:
  - The filename starts with or contains the Jira key (e.g., `PROJ-123-pin-content-in-admin.md`).
  - Or the file contents contain the Jira key (e.g., in the frontmatter `refs: "PROJ-123"` or as text in the description/steps).
- Read the content of all matching test cases. Understand their:
  - Preconditions and Roles (e.g., Admin, Editor, User).
  - Action steps and Expected results.
  - Assertions and logic.

### 4. Perform Alignment & Discrepancy Analysis
Analyze the relationship between what was actually implemented (from the code review report) and what is expected to be tested (from the test cases). Evaluate and document the following:

1. **Test Coverage Gaps**:
   - What new functionality described in the code review report has no corresponding coverage in the test cases? (e.g., a new UI confirmation modal, a new error state, or a new config value).
   - Are there new API queries, parameters, or response fields that are not verified in the test cases?
2. **Selector & Technical Discrepancies**:
   - Compare selectors used/changed in the implementation (e.g., `button[data-test='pin-article-btn']`) with the actions described in the test cases. Check if selectors have changed, been removed, or if they need to be added to Page Objects.
3. **Logic & Behavioral Conflicts (Implementation Bugs)**:
   - Does the implementation description show logic that contradicts the test case expectations or requirements? (e.g., the test case expects a 5-hour pinning duration, but the code review notes show a different duration, or the limit logic is implemented incorrectly).
   - Check if there are code review findings (e.g., memory leaks, database queries, edge-case vulnerabilities) that should be explicitly tested or raised as bugs.
4. **Edge Cases & Regression Risks**:
   - List specific edge cases from the code review report that are missing in the test cases.
   - Outline regression risk areas (parts of the app not directly changed but affected) that the test cases do not cover.

### 5. Generate and Save the QA Alignment Report
- Create a QA alignment report in the `ai-report/` directory.
- The path must be `ai-report/[JiraKey]-qa-alignment.md` (e.g., `ai-report/PROJ-123-qa-alignment.md`).
- Write the report using the **QA Alignment Report Template** below.
- Save the file using the `write_to_file` tool (with `Overwrite: true`).

### 6. Summary and Recommendations to the User
- Present the relative link to the generated report: `[JiraKey]-qa-alignment.md` (e.g., [PROJ-123-qa-alignment.md](ai-report/PROJ-123-qa-alignment.md)).
- In your chat message, provide a bulleted summary of:
  - **Critical Discrepancies/Bugs**: Any mismatch between implementation and test cases, or potential code bugs.
  - **Key Testing Focus**: The most important flows, roles, or edge cases to test.
  - **Required Test Case Updates**: A quick note on which test case files need updates.

---

## QA Alignment Report Template

```markdown
# QA Alignment & Discrepancy Report: [JiraKey]

- **Jira Ticket:** [[JiraKey]](https://your-company.atlassian.net/browse/[JiraKey])
- **Code Review Report:** [[JiraKey]-report.md](ai-report/[JiraKey]-report.md)
- **Matched Test Cases:**
  - [Test Case File Name 1](test-cases/[PathToTestCase1]) (Refs: `[JiraKey]`)
  - [Test Case File Name 2](test-cases/[PathToTestCase2]) (Refs: `[JiraKey]`)

---

## 🔍 Executive Alignment Summary
[Provide a summary of how well the implemented code changes align with the written test cases. Mention if the test cases are largely sufficient or if there are major gaps/discrepancies.]

---

## ⚠️ Discrepancies & Potential Bugs
> [!IMPORTANT]
> This section lists differences between implementation details and test expectations, or bugs found during the code review analysis.

### 1. [Discrepancy / Bug Title]
- **Type:** [e.g., Logic Contradiction / Missing Step / Selector Mismatch / Code Bug]
- **Description:** [Explain what is different or what bug was identified.]
- **Impact:** [Why this matters for QA or user experience.]
- **Recommended Action:** [e.g., Update test case, Fix code implementation, Raise Jira ticket]

### 2. [Another Discrepancy / Bug]
...

---

## 🎯 Targeted QA Testing Recommendations
Based on the code changes and potential regression risks, QA should focus testing on:

### 1. Areas to Test
- **[Area 1 (e.g. Admin UI)]**: [Specifically what to test, roles to use, and expected behavior]
- **[Area 2 (e.g. Tag Feed API)]**: [Specifically what to test]

### 2. Regression Risk Zones
- **[Zone 1]**: [Surrounding functionality that might be affected, and how to verify it is intact]

### 3. Edge Cases & Negative Scenarios
- [ ] **[Scenario 1]**: [Prerequisites and steps to verify this edge case]
- [ ] **[Scenario 2]**: [Prerequisites and steps to verify this edge case]

---

## 📝 Suggested Test Case Updates
Below are the recommended updates to existing test cases or blueprints for new test cases.

### [Test Case File Name 1] ([Relative Path])
```diff
[Insert markdown diff here showing proposed additions or modifications to the test case steps/expectations]
```

### [New Test Case Blueprint] (If a new test case is needed)
- **Proposed Path:** `test-cases/[Folder]/[FileName].md`
- **Title:** `[Title]`
- **Refs:** `[JiraKey]`
- **Content Outline:**
  [Brief outline of Preconditions, Steps, and Expected outcomes for the new test case]
```
