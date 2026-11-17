# Playwright QA Automation Portfolio

A test automation framework I built and maintain for a multi-locale sports media platform
(news, blogs, threads, comments, polls, user profiles) with several regional projects and 10+ languages.

> This is a sanitized excerpt of a production framework. Company names, domains, credentials,
> internal API endpoints and ticket references have been removed or replaced
> (`example.com`, `SportsApp`, environment variables). It is published for portfolio purposes;
> running it requires a compatible backend.

## Tech stack

- **Playwright Test** (JavaScript, ES modules)
- **Page Object Model** with reusable components (comments, modals, widgets, subscriptions)
- **GraphQL API testing** via Playwright `request` + Firebase auth
- **SEO testing** — status codes, redirects, robots, canonical, hreflang (HTTP mode via Node `fetch` and browser mode)
- **Allure** + HTML + JUnit reporting
- **Docker** image and CI pipeline (GitHub Actions example)
- Data-driven tests with **Faker**

## What's inside

| Folder | Content |
| --- | --- |
| `tests/uiRegression` | 21 UI specs: auth (login / signup / reset password), blogs, comments (incl. A/B test), subscriptions, threads, user profile |
| `tests/api` | 42 API specs: blogs, bookmarks, chat, comments, complaints, polls, reviews, subscriptions, users + E2E flows |
| `tests/seo` | 25 SEO specs (blogs, threads, news, polls) with per-project / per-locale test data |
| `pages/` | Page Objects and shared components |
| `src/` | Constants, locales, helpers (UI auth via storage, A/B test helper) |
| `test-cases/` | Markdown test cases the automated tests are generated from / linked to |
| `global-setup.js` | Logs in test users once via API and caches tokens for UI and API tests |

## Highlights

- **Multi-project / multi-locale**: one test runs against UA / BY / INT projects; expected texts and test data are resolved per project and language.
- **Fast authenticated UI tests**: tokens are obtained via API in global setup and injected into `localStorage`, so UI tests skip the login form.
- **Lightweight SEO checks**: public pages are fetched without a browser (~0.3–1.5 s per page instead of ~10 s), which also fixed CI pods running out of memory.
- **Resilience**: retries, trace/video on failure, network-error tolerant SEO page object.
- **Mobile coverage**: UI suites also run on a mobile device profile.

## Running

```bash
npm install
npx playwright install
cp .env.example .env   # fill in URLs and test accounts
npm run test:seo
npm run test:api
npm run test:ui
npm run report         # Allure report
```
