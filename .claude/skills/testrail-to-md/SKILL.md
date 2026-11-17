---
name: testrail-to-md
description: Retrieve test case from TestRail using MCP and convert it to a Markdown file with Frontmatter.
---

# TestRail to Markdown Skill

This skill guides you through the process of converting a TestRail test case into a standardized Markdown (`.md`) format, using YAML frontmatter for test metadata.

## Steps

### 1. Fetch Test Case from TestRail
- Ask the user for the TestRail `caseId` if not already provided.
- Use the `mcp_testrail_getCase` tool from the TestRail MCP server with the provided `caseId`.
- Extract relevant fields from the response, such as `id`, `title`, `section_id`, `priority_id`, `type_id`, `refs`, `custom_steps`, `custom_expected`, `custom_steps_separated`, and `custom_preconds`.

### 2. Format the Markdown Structure
- Create a YAML Frontmatter block at the top of the file to store the test metadata.
- **CRITICAL:** Convert any HTML tags in the TestRail fields (`custom_steps`, `custom_expected`, `custom_steps_separated`, `custom_preconds`) into clean, native Markdown format (e.g., `<ol><li>...</li></ol>` -> `1. ...`, `<p>` and `<br>` to newlines, `<strong>` to `**`, `<a href="...">text</a>` to `[text](...)`). Do not leave raw HTML tags in the final output.
- Create sections in the Markdown body for Preconditions, Steps, and Expected Results.
- Add a markdown checkbox (`[ ]`) to each main step for easier tracking.

Format Example:
```markdown
---
id: [Case ID]
title: "[Test Case Title]"
section_id: [Section ID]
priority_id: [Priority ID]
type_id: [Type ID]
refs: "[References, if any]"
---

# [Test Case Title]

## Preconditions
[Content from custom_preconds, if it exists]

## Steps
[Use custom_steps text, OR if custom_steps_separated exists, format as a numbered list:]
1. **Action:** [Step content]
   **Expected:** [Expected result for this step]

## Expected Results
[Content from custom_expected, if it exists]
```

### 3. Save the File
- Determine where to save the `.md` file based on user instructions, or save it in a logical directory (e.g., `docs/test-cases/` or the current working directory).
- Construct a readable filename using the case ID and title, for example, `C[CaseID]-[formatted-title].md` (e.g., `C1234-login-tests.md`).
- Use the `write_to_file` tool to create the file with the generated content.

### 4. Verify
- Inform the user that the Markdown file has been created successfully.
- Provide the path to the newly created file.
