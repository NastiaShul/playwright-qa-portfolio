---
name: Jira MR Code Changes Analyzer
description: Retrieve a Jira ticket, traverse sub-tasks, find linked GitLab Merge Requests, analyze code changes, and generate QA-focused impact analysis reports.
---

# Jira MR Code Changes Analyzer Skill

This skill guides you through the process of analyzing code changes for a given Jira ticket (and all of its sub-tasks) by finding linked GitLab Merge Requests (MRs), retrieving their code diffs, and generating a local analysis report. 

This report helps QA engineers design targeted tests and assists other AI agents in auditing/updating automated test cases based on actual code modifications.

---

## Steps

### 1. Identify and Parse Issue Reference
- Request the Jira issue ID/key (e.g., `PROJ-123`) or Jira URL from the user.
- Extract the issue key (e.g., `PROJ-123`).
- Determine the Jira Site ID/Host. Default to `your-company.atlassian.net` if only the key is provided.

### 2. Fetch Jira Issue Details & Sub-Tasks
- Use the `getJiraIssue` tool from the `atlassian-mcp-server` to fetch the primary ticket details.
  - Set `cloudId`: `your-company.atlassian.net` (or the parsed host).
  - Set `issueIdOrKey`: The issue key.
  - Set `fields`: `["summary", "description", "status", "subtasks", "project"]`.
- Check if the issue has sub-tasks by inspecting the `subtasks` field in the response.
- Compile a list of all Jira keys to analyze: the primary Jira key and all sub-task keys.

### 3. Fetch Web/Remote Links for All Tickets
- For the primary ticket and each sub-task key, call the `getJiraIssueRemoteIssueLinks` tool:
  - Set `cloudId`: `your-company.atlassian.net` (or the parsed host).
  - Set `issueIdOrKey`: The Jira ticket key.
- Examine the remote links returned. Filter for links pointing to GitLab Merge Requests.
  - Typical patterns: `https://gitlab.com/[group]/[project]/-/merge_requests/[IID]` or custom domain GitLab URLs containing `/merge_requests/`.
- Extract two values from each GitLab MR link:
  1. **Project ID**: The URL-encoded path to the project (e.g., `group/frontend` becomes `group%2Ffrontend`) or numerical project ID if visible.
  2. **Merge Request IID**: The merge request ID number (e.g., `1234`).

### 4. Fetch GitLab MR Details & Diffs
- For each unique GitLab MR found:
  - Call `get_merge_request` from the `gitlab` MCP server:
    - Set `project_id`: The extracted project path/ID.
    - Set `merge_request_iid`: The MR IID.
    - Note the MR Title, description, source branch, target branch, and author.
  - Call `get_merge_request_diffs` (or `list_merge_request_changed_files` first to see the list of files if the changes are expected to be very large):
    - Set `project_id`: The project path/ID.
    - Set `merge_request_iid`: The MR IID.
    - (Optional) Use `excluded_file_patterns` to skip generated assets or lockfiles (e.g., `["package-lock.json", "yarn.lock"]`).
- Read and aggregate the code diffs for analysis.

### 5. Perform Code and QA Impact Analysis
Analyze the collected code diffs to determine the scope of changes. Group your analysis into:
- **Frontend Changes**: UI components, visual updates, new element attributes (especially `data-test` or `data-testid`), routing/page path changes.
- **Backend / API Changes**: Endpoints modified/added, new query/mutation parameters, payload structures, headers.
- **Configuration & Environment**: Database migrations, `.env` file changes, setting variables.
- **QA Impact Analysis**:
  - What features/flows are directly modified?
  - What are the regression risks? (Which surrounding features could be broken by these changes?)
  - What edge cases, negative test scenarios, or permission roles need validation?
- **Test Alignment**:
  - What existing autotests (`tests/` directory) or test cases (`test-cases/` directory) cover this functionality?
  - Are there new tests that must be created?

### 6. Generate and Save the AI Analysis Report
- Create the target directory `ai-report/` in the root of the workspace if it does not already exist.
- Formulate a report filename using the primary Jira key: `ai-report/[JiraKey]-report.md` (e.g., `ai-report/PROJ-123-report.md`).
- Write the report using the template below. Ensure the **Agent-Parsable Change Spec** section is strictly populated with structured YAML/JSON to enable subsequent test case alignment by agents.
- Save the file using the `write_to_file` tool (setting `Overwrite: true` to allow updates if run multiple times).

---

## AI Analysis Report Template

```markdown
# AI Code Analysis Report: [JiraKey] - [JiraTitle]

## Jira Metadata
- **Primary Ticket:** [[JiraKey]](https://your-company.atlassian.net/browse/[JiraKey])
- **Status:** [JiraStatus]
- **Sub-tasks Analyzed:**
  - [ ] [SubTaskKey-1]: [SubTaskTitle-1]
  - [ ] [SubTaskKey-2]: [SubTaskTitle-2]
- **GitLab Merge Requests:**
  - [MR-1 URL] ([MR-1 Title])
  - [MR-2 URL] ([MR-2 Title])

## Executive Summary
[A concise 2-3 sentence description of the overall code changes and their purpose.]

## Code Changes Breakdown
| File Path | Component / Type | Action | Key Changes |
| :--- | :--- | :--- | :--- |
| `path/to/file.js` | Frontend / API | Modified / Added | Brief explanation of changes |

## QA Impact & Testing Recommendations

### 🎯 Direct Verification Scenarios
1. **[Scenario Title]**
   - **Prerequisites:** [e.g., specific user role, config setting]
   - **Testing steps:** How to trigger and verify the change.
   - **Expected behavior:** What specifically should be visible or returned.

### ⚠️ Regression Risk & Areas of Caution
- **[Risk Area 1]:** [Why this is at risk and how to verify it wasn't broken.]
- **[Risk Area 2]:** [Why this is at risk and how to verify it wasn't broken.]

### 💡 Suggested Edge Cases & Negative Scenarios
- [ ] [Edge case 1, e.g., missing query params, unauthorized access, empty states]
- [ ] [Edge case 2, e.g., long inputs, network disconnect, rapid clicks]

---

## 🤖 Agent-Parsable Change Spec
> [!NOTE]
> This section is formatted for automated parsing by test-generation and test-audit agents. Keep definitions clean and concise.

```yaml
jira_key: "[JiraKey]"
timestamp: "[CurrentISOString]"

changed_apis:
  - endpoint: "/api/example"
    method: "POST"
    payload_changes: "Added field 'pinned' (boolean, optional)"
    response_changes: "Returns 'pinnedAt' (ISO timestamp string) in response payload"

ui_changes:
  - page: "Admin Pinned Content Panel"
    selectors_added:
      - "button[data-test='pin-article-btn']"
      - "div[data-test='pinned-badge']"
    selectors_removed: []
    behavior_notes: "Clicking pin button shows a confirmation modal prior to sending POST request"

config_changes:
  - file: "playwright.config.js"
    variable: "use.baseURL"
    details: "Added custom headers for testing session"

test_files_impacted:
  - file_path: "tests/api/apiRegression/apiNews/newsQuery.js"
    action: "Modify (need to add pinned fields to payload assertion)"
  - file_path: "tests/uiRegression/admin/pinContent.spec.js"
    action: "Create (new test for verifying admin pin behavior)"
```
```

---

## 7. Report and Confirm
- Confirm completion to the user.
- Provide the relative link to the generated report: `[JiraKey]-report.md` (e.g., [PROJ-123-report.md](ai-report/PROJ-123-report.md)).
- Highlight the most critical QA risk or edge case discovered in your brief summary text.
