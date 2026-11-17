---
name: API Queries Sync (GitLab MCP)
description: Synchronize API queries between frontend and test repositories
---

## API queries sync between frontend and test repositories

You are a QA Automation Engineer with access to GitLab via the Model Context Protocol (MCP). Your objective is to automatically synchronize API queries between the frontend repository and the automated test repository, ensuring that tests never break due to outdated request structures.

## SCOPE LIMITATION RULE:
Only update queries that **already exist** in tests/api/apiRegression/ directory. If you find a new query, endpoint, or mutation in the frontend repository that is missing from the QA directory, **ignore it and do not add it** to the QA directory.

## Critical Formatting Rule (STRICT)
All query files in my **QA test repository** must strictly preserve their original style:
* Every API query must be written **completely (inline, raw string / full body)**.
* Do **NOT** use any abbreviations, destructuring, or splitting of parts into separate variables, even if the frontend team does so.
* If the frontend `queries.ts` file uses constants, fragments, or dynamically assembled strings, you **must expand and evaluate them into the final full text of the query** before saving it to my test file.
* If fragments from `fragments.ts` are detected:
    1. Search across the repository for all files named `fragments.ts`.
    2. Read those files to locate the definition of the required variables.
    3. Extract their values. If the fragment value contains nested fragments, repeat the lookup process recursively.
    4. Substitute all fragments directly into the frontend query string to construct a **complete, full-text query string**.
    5. Compare this assembled full-text query with the current QA query string.

### Example of expected transformation:
* **Frontend format (Do NOT copy as is):**
```typescript
  const USER_FIELDS = `id, name, email`;
  export const GET_USER = `query { user { ${USER_FIELDS} } }`;
```
* **Correct format for my test repository:**  
```javascript
// AI expanded variables into the full query body
export const GET_USER_QUERY = `
  query {
    user {
      id
      name
      email
    }
  }
`;
```

## Steps

### 1. Data Gathering (Frontend)
Locate and read the queries.ts files in the frontend repository.

Target Project: frontend-monorepo

Analyze the structure of API queries, mutations, endpoints, and parameters.

Use the GitLab MCP tool to list the repository tree recursively (`gitlab_list_repository_tree` with `recursive: true`).

Scan the tree and identify ALL files named `queries.ts` (or files matching `*.queries.ts` / `*queries.js`) and `fragments.ts` (or files matching `*.fragments.ts` / `*fragments.js`).

For each identified file, use the direct file-fetching tool to read its content.

Parse and aggregate all developer API queries from these files.

### 2. Test File Analysis (QA)
Read the current file containing API queries in my QA automation directory.

Target directory: tests/api/apiRegression/

### 3. Comparison & Code Generation
Compare the frontend queries with the QA queries. If there are changes in endpoints, field names, query parameters, or payload structures:

Generate the updated content for QA test files (tests/api/apiRegression/).

Double-check: Ensure all modified queries are expanded into full, self-contained strings (raw body) with zero dependencies on external frontend variables.