---
name: jira-to-md
description: Retrieve ticket from Jira using MCP, parse requirements/acceptance criteria, and create markdown test cases.
---

# Jira to Markdown Skill

This skill guides you through the process of converting a Jira ticket's requirements and acceptance criteria into standardized Markdown test cases within the `test-cases/` directory.

## Steps

### 1. Parse Issue Reference
- Ask the user for the Jira issue ID, key, or URL (e.g., `PROJ-123` or `https://your-company.atlassian.net/browse/PROJ-123`) if not already provided.
- Extract the issue key (e.g., `PROJ-123`).
- Identify the Jira site/cloud ID. If a full URL is not provided, default to `your-company.atlassian.net` (which is the configured site for this workspace).

### 2. Fetch Issue Details from Jira
- Use the `getJiraIssue` tool from the Atlassian MCP server.
- Set parameters:
  - `cloudId`: The identified site host (e.g., `your-company.atlassian.net`).
  - `issueIdOrKey`: The extracted issue key.
  - `responseContentFormat`: `"markdown"` (to retrieve descriptions in clean markdown format).
  - `fields`: Include `"summary"`, `"description"`, `"priority"`, `"status"`, `"comment"`, `"project"`, and `"labels"`. (Fetching comments is important if additional requirements or details are discussed there).

### 3. Analyze Requirements & Acceptance Criteria
- Parse the issue `summary`, `description`, and any `comments`.
- Look for sections named "Acceptance Criteria", "Вимоги", "Requirements", "AC", "QA", or list of tasks/features.
- Group the requirements into logical test scenarios (e.g., UI checks, functional flows, error handling, permission checks). Each logical scenario should become a separate test case.

### 4. Determine Target Directory
- Decide the target platform folder based on the ticket context, labels, or description:
  - Web applications -> `test-cases/web/`
  - Android application -> `test-cases/android/`
  - iOS application -> `test-cases/iOS/`
  - Admin panel / backend -> `test-cases/admin/`
- Identify the most relevant subdirectory/module folder (e.g., `test-cases/web/news/` or `test-cases/web/mainPage/`).
- If no suitable subdirectory exists, you can create a new folder under the platform directory.

### 5. Format and Generate Test Cases
- Construct a descriptive, URL-friendly filename: `[JiraKey]-[formatted-title].md` (e.g., `PROJ-123-onboarding-kateryna.md`). Use lowercase letters and hyphens to replace spaces and special characters.
- At the top of the file, create a YAML frontmatter block:
  ```markdown
  ---
  id: null
  title: "[Test Case Title]"
  section_id: null
  priority_id: [Priority ID]
  type_id: null
  refs: "[JiraKey]"
  spec_file: ""
  ---
  ```
  - Map the Jira priority to `priority_id`:
    - Blocker / Highest / Critical -> `1`
    - High / Major -> `2`
    - Medium / Default -> `3`
    - Low / Minor / Trivial -> `4`
  - Set `refs` to the Jira issue key (e.g., `"PROJ-123"`).
  - Set `id`, `section_id`, `type_id`, and `spec_file` to `null` or empty strings as these will be updated later.

- Construct the Markdown body of the test case following this structure:
  ```markdown
  # [Test Case Title]

  ## Preconditions
  [State any prerequisites, URL, credentials, staging settings, user roles, etc.]

  ## Steps
  1. [ ] **Action:**
     [Action details]

     **Expected:**
     1. [Expected result for step 1]
     2. [Additional expected result for step 1]

  2. [ ] **Action:**
     [Action details]

     **Expected:**
     1. [Expected result for step 2]

  ## Expected Results
  [Summary of overall expectations or leave empty if steps cover everything]
  ```
  - Ensure all checkbox steps follow the `1. [ ] **Action:**` syntax strictly.
  - Convert any Jira markup or HTML formatting from description/comments into clean native Markdown.

### 6. Save the File
- Write the formatted test case(s) using the `write_to_file` tool in the target folder.
- Confirm with the user, providing the file paths and showing the generated markdown content.
