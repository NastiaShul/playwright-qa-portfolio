---
name: seo-to-playwright
description: Convert a row from the SEO requirements spreadsheet into a markdown test case and a Playwright JS SEO test for SportsApp (UA/BY/INT) using the shared SeoPage Page Object. Use for any new or updated SEO test in tests/seo/ — every SEO spec must have a matching test case in test-cases/seo/.
---

# SEO to Playwright Skill

This skill guides you through the process of converting one row of the SEO requirements spreadsheet into a Ukrainian markdown test case (`test-cases/seo/`) and a Playwright test (`tests/seo/`) for SportsApp projects UA, BY and INT.

> **Every SEO page produces exactly three files: test case `.md` + data file + spec.**
> A spec without a test case is an incomplete task. Never skip Step 5, even when the spec is copied from a similar page.

## Steps

### 1. Parse the Spreadsheet Row

The user pastes a tab-separated row. Map the columns:

| Column | Usage |
|---|---|
| К чему относится / Тип страницы | test case title, file names |
| Админка | not used |
| Seo Type | not checked (JSON-LD is out of scope) |
| Индексация | `noindex` / `index` / condition (e.g. "noindex, если до 5 шт.") / canonical rule (e.g. "canonical на /news/") |
| Шаблон UA\|BY / Шаблон INT | URL template without language; `%id%` is the dynamic part; `-` means not covered |
| Hreflang | codes per project with x-default per project inside the cell, or ready `<link>` tags |
| UA-ru, uk, BY-ru, BY-be, INT-en … INT-pl | example URLs: ids for indexed states, hrefs for shared pages |

Show the user a short table: page, covered projects, template, indexation, hreflang and x-default per project, example ids.

Then continue without asking for confirmation. Stop and wait for the user only when Step 2 has open questions.

### 2. Clarify Missing Requirements

Ask the user (do not guess) when the row does not say:

- what `%id%` is and whether the app substitutes it after navigation;
- whether the page is public and what a guest gets (403, redirect);
- the ready-state locator for auth pages (look in `pages/` first);
- condition boundaries (e.g. "до 5" — is exactly 5 noindex?);
- whether the empty state exists at all (e.g. a profile tab without content returns 404);
- x-default for a project that has no x-default line;
- the codes list and example URLs disagree (e.g. no `uk` in the list, but a `/uk/` example) — likely a typo.

### 3. Select Test Data

| What is needed | Test data |
|---|---|
| Page with content (indexed state) | example ids / hru from the row, per project. Verify on stage: 200, no noindex |
| Entity page without content (club, person, tournament) | an entity of the same type without content that exists on stage, e.g. club `altay` |
| User profile without content | role `emptyUser` from `auth-token.json` (its userId via `getUserId`) |
| Auth-only page (create blog / post) | log in with `authState(context, "user")` (or `"admin"` if the page needs it) |

Roles `user` / `user2` / `admin` are only for logging in — never use their profiles as test data: other tests change their content.
- Project not covered (Hreflang cell says "только для …", or the template / all example URLs of the project are `-`) → leave it out of the data file.

### 4. Check Existing Tests and References

Existing SEO tests: `tests/seo/<category>/*.seo.spec.js`, `test-cases/seo/*.md`. If the page is already covered — update those files (both the spec and the test case).

Copy the structure of the closest reference:

| Case | Reference spec | Reference test case |
|---|---|---|
| one project, conditional indexation | `profilePosts.seo.spec.js` | `seo-user-profile-posts.md` |
| auth-only page, guest 403 | `createBlog.seo.spec.js` | `seo-create-blog.md` |
| `%id%` substituted by the app | `createPost.seo.spec.js` | `seo-create-post.md` |
| canonical rule | `profilePostsPagination.seo.spec.js` | `seo-user-profile-posts-pagination.md` |
| shared between projects, ready `<link>` tags | `mainPage.seo.spec.js` | `seo-main-page.md` |
| shared between projects, list of codes, not all projects | `newsPage.seo.spec.js` | `seo-news-page.md` |
| several states and noindex languages, one check = one test | `personPage.seo.spec.js` | `seo-person-page.md` |
| entity tab with content, empty → 404 | `clubBlogs.seo.spec.js` | `seo-football-club-blogs.md` |
| UA/BY only, indexable, no hreflang | `tournamentBlogsRating.seo.spec.js` | `seo-football-tournament-blogs-rating.md` |

### 5. Create the Test Case (mandatory)

- Save to `test-cases/seo/seo-<section>-<page>.md` (kebab-case).
- `spec_file` in the frontmatter must point to the spec from Step 6 — this links the test case to the test.
- Write in Ukrainian: translate page names and conditions, keep technical values (`noindex`, URLs, hreflang codes) as is.
- One step per check; both states of a conditional indexation in one test case.
- List uncovered languages / projects in a `>` note under Preconditions (e.g. INT `pt-br`, `pl` not published yet).
- `refs: null` — do not ask for a Jira key; fill it only if the user gives one on their own.

Format example:

```markdown
---
id: null
title: "[WEB][SEO] <Розділ>, <Тип сторінки> — <short summary>"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/<category>/<pageName>.seo.spec.js"
---

# [WEB][SEO] <Розділ>, <Тип сторінки> — <short summary>

## Preconditions
1. Оточення: stage. Мовні версії: <covered projects and languages>.
2. <Test data: emptyUser / profiles from the SEO table / authorized user>.
3. <Guest or authorized>.

## Steps
1. [ ] **Action:**
   Відкрити сторінку за шаблоном `/{lang?}/<template>` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити директиви robots у `<head>` (`meta[name="robots"]`) та в HTTP-заголовку `X-Robots-Tag`.

   **Expected:**
   1. <Присутня / Відсутня> директива `noindex`.

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. <Теги hreflang відсутні / list of hreflang → prod URL>.
   2. `x-default`: <per project, from the SEO table>.

## Expected Results
<What the page must be for search engines in each state.>
```

### 6. Create the Data File and Spec

Save to `tests/seo/<category>/data/<pageName>.seo.data.js` and `tests/seo/<category>/<pageName>.seo.spec.js`.

Categories (one folder per page group, data next to its specs): `blogs`, `club`, `match`, `news`, `person`, `polls`, `profile`, `tags`, `team`, `threads`, `tournament` (and any newer folder in `tests/seo/`). Pick the folder by the page section (e.g. `clubSquad` → `club/`, `matchHubStat` → `match/`, `personalFeed` → `profile/`); create a new one only for a new section. Imports from a category folder: `../../../pages/seo.page`, `../../api/utils/functions/checkProject`, `../../../src/...`.

Data file: template, users / ids per project, `<pageName>XDefault = { UA, BY, INT }` (language or `null`), comments in English.

Choose the mode before writing the spec — `SeoPage` has the same check methods in both:

| Page | Mode | Why |
|---|---|---|
| Opens for a guest (any status: 200 / 301 / 403 / 404) — including other users' profiles and pages that only take a userId from `auth-token.json` | **HTTP** — `SeoPage.request()` | status, redirect, robots, canonical and hreflang are all in the server response |
| Needs a logged-in user: own profile tabs, bookmarks, personal feed, create blog / post | **Browser** — `new SeoPage(page)` + `authState` | the real page appears only after client-side auth |

In an auth spec, the guest `describe` (403 check) can still use HTTP mode. Browser mode is ~20× slower and loads the CI pod — use it only when HTTP mode cannot see the page.

Spec structure:

- one `test.describe` per state;
- public pages (default): the page is fetched once **without a browser** — `test.beforeAll(async () => { seoPage = SeoPage.request(); await seoPage.open(url); })`, and `await seoPage?.close();` in `test.afterAll`. `SeoPage` parses the SSR `<head>` of the HTML response (~0.5 s per page instead of ~10 s in a browser). Do not create Playwright `request` contexts for SEO pages: Playwright traces them with the full HTML of every page (CI pod OOMKilled);
- each check is a separate `test` — a failed check does not stop the others;
- auth pages only (need a logged-in user or client rendering): browser mode — `browser.newContext({ userAgent: "UIAutotest" })` + `authState(context, "user")`, `seoPage = new SeoPage(await context.newPage())`, then the ready-state wait with `{ timeout: 20000 }` in the same `beforeAll`. Do not use the browser for public pages;
- uncovered projects: loop over `pages[project] ?? []`;
- 4-space indent, no `afterEach`, no `test.use`, no `isMobile` code.

Map the spreadsheet to `SeoPage` methods:

| Spreadsheet | SeoPage |
|---|---|
| template, public page | `checkStatusCode(200)` + `checkUrlIsNotRedirected(url)` |
| template, auth page | ready-state locator or `toHaveURL(buildSeoUrlPattern(...))`, no status check (SSR returns 403) |
| guest on auth page | separate `describe("Guest")`, `checkStatusCode(403)` |
| empty tab does not exist | `checkStatusCode(404)` + `checkPageIsNoindex()` |
| noindex / index | `checkPageIsNoindex()` / `checkPageIsIndexable()` |
| hreflang "нет" or noindex page | `checkHreflangsAreAbsent()` |
| hreflang, one-project page | `checkHreflangs(buildExpectedHreflangs(project, template, id, <pageName>XDefault[project]))` |
| hreflang, shared page | `checkHreflangs(<explicit object from the data file>)` |
| "canonical на …" | only `checkCanonicalLink(buildProdUrl(project, locale, <target template>, id))`, no indexation checks |

### 7. Self-check

- [ ] The test case exists in `test-cases/seo/` and its `spec_file` matches the spec path.
- [ ] Every test-case step has a matching test and vice versa.
- [ ] Every data-file export is used in the spec (an unused `XDefault` is a silent bug — UA/BY pass by accident, only INT fails).
- [ ] Imports match the current exports (a missing export hides the file from Playwright).
- [ ] Public page → HTTP mode (`SeoPage.request`), no `browser.newPage`; browser mode only for pages that need a logged-in user.

Quick check that no spec is left without a test case:

```bash
for f in tests/seo/*/*.spec.js; do grep -rqF "$f" test-cases/ || echo "MISSING: $f"; done
```

### 8. Run and Verify

Run with the desktop project on every covered project (stage by default; qa / dev work the same way — replace `stage` in the host):

| Project | BASE_URL |
|---|---|
| UA | `https://stage.ua.example.com/` |
| BY | `https://stage.by.example.com/` |
| INT | `https://stage.example.com/` |

```bash
BASE_URL=<url> npx playwright test tests/seo/<category>/<pageName>.seo.spec.js --project=chromium --retries=0 --reporter=list
```

- Read `toEqual` diffs as: `-` = expected (spreadsheet), `+` = received (page).
- Test issue → fix the test. Page differs from the spreadsheet → keep the expectation and report a possible bug with expected vs actual values (Step 9).
- Bug tests stay red: do not add `test.fail` / `test.skip` and do not offer to. Add `test.fail(<project condition>, "<short reason>")` only when the user asks for it explicitly.

Inform the user which files were created (test case, data file, spec) and which tests failed and why.

### 9. Report Bugs to the Slack List

Every bug found (page differs from the spreadsheet) goes to the team bug list in Slack (`list_id` from the `SEO_BUGS_SLACK_LIST_ID` setting).

1. Read the list (`slack_read_list`) and look for a duplicate: a record that names **this exact page** (section + page type, e.g. «Клуб … рейтинг блогов») and the same problem. Existing record (any status, including `skip` / `В беклог`) → do not add, tell the user the record name and status.
   - A record about another page (e.g. tournament instead of club) or a generic one without a page (e.g. «юа/бай: рейтинг блогов не должно бьіть хрефлангов») is **not** a duplicate — draft a new record and mention the similar one to the user.
2. Draft one record per bug — one page + one problem (several projects with the same problem → one record). Every failing check on the page is a separate bug: e.g. 404 on BY and hreflang on UA → two records. Do not mention other pages in Details; a bug found on another page gets its own record.

   | Column | Value |
   |---|---|
   | Name | `[<projects>] <Раздел>-<Тип страницы>. <что не так>` — in Russian, like the existing records. `<projects>` = where the bug reproduces: `UA`, `BY`, `UA/BY` or `INT`. E.g. `[BY] Футбол-Клуб Рейтинг блогов. Страница отдает 404, по таблице должна индексироваться` |
   | Details | URL on stage, expected (spreadsheet) vs actual (page), spec path |
   | Severity | empty — do not set it |
   | Status | `New` |
   | Assignee | empty |

   `Date submitted` and `Submitted by` are filled by Slack — do not pass them.
3. Show the drafts to the user and **wait for confirmation** before adding — the list is shared with the team.
4. Add the confirmed records with `slack_add_list_record` and give the user the record links.

## Reference

### Hreflang rules

x-default is written per project inside the Hreflang cell: "нет x-default" → `null` (must be absent), "x-default - англ" → `"en"` (укр → `uk`, бел → `be`).

One-project pages (profile, tabs, blogs) use `src/locales/seoLocales.js`:

| Project | Locale → prefix → hreflang |
|---|---|
| UA | `ru` → no prefix → `ru`; `uk` → `uk/` → `uk` |
| BY | `ru` → no prefix → `ru`; `be` → `be/` → `be` |
| INT | `en`, `de`, `fr`, `it`, `es`, `ar`, `pl` → `<lang>/` → same; `pt-br` → `pt-br/` → `pt-BR` |

Shared pages (main, «Футбол», tags, sports, news feed, entity blogs tabs) have the same hreflang set on every page of the group, with links between projects. Build an explicit `{ hreflang: prodUrl }` object in the data file and include it in the Step 1 table (no separate confirmation):

- ready `<link>` tags in the cell → copy them (ignore `data-next-head`);
- list of codes → code → example URL column: UA-ru → `ru`, uk → `uk`, BY-ru → `ru-RU` + `ru-BY` + `ru-KZ`, BY-be → `be`, INT-… → `<lang>` (pt-br → `pt-BR`);
- INT language versions may be subdomains (`de.example.com`) → `buildSubdomainUrl(BASE_URL, subdomain, path)`.

### Helpers (`src/locales/seoLocales.js`)

- `buildSeoUrl` — page URL on the current env.
- `buildProdUrl` — the same page on prod (expected canonical/hreflang).
- `buildSeoUrlPattern` — RegExp for an app-substituted `%id%`.
- `buildExpectedHreflangs(project, template, id, xDefault)` — expected hreflang for one-project pages.
- `buildSubdomainUrl` — URL for subdomain language versions.
- `getUserId(role)` — userId from `auth-token.json`.

## Best Practices

- One page type = one test case + one data file + one spec; one check = one test.
- Expected canonical/hreflang are always prod URLs — `SeoPage` drops the env label (`stage.`, `qa.`, `dev.` — `TEST_ENVS` in `seo.page.js`) from actual links. Never build expectations from `BASE_URL`. A new env → add it to `TEST_ENVS`.
- Auth pages: SSR returns 403, the real page appears after client-side auth; `X-Robots-Tag` comes from the 403 response.
- SEO tests run on desktop only — mobile projects ignore `**/seo/**` in `playwright.config`.
- Test users exist only on test envs (stage, qa, dev), not on prod. Spreadsheet example ids exist on stage, qa and dev.
- Known stage bugs live in the Slack list from Step 9 — check it instead of keeping a list here.
- No SEO logic in specs — extend `pages/seo.page.js` if a new check is needed.
- Never hardcode tokens; only userId / role from `auth-token.json`.
- Code and comments in English, test cases in Ukrainian.