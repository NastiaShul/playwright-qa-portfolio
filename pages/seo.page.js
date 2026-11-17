import { expect } from "@playwright/test";
import { parse } from "node-html-parser";

// Test environments: stage.example.com, qa.ua.example.com, fr.dev.example.com…
const TEST_ENVS = ["stage", "qa", "dev"];

// Some pages link to the current env, others to prod even on a test env.
// Drop the env label from the host so links are always compared with prod URLs.
const toProdUrl = (url) => {
  const parsed = new URL(url);
  parsed.hostname = parsed.hostname.replace(new RegExp(`(^|\\.)(${TEST_ENVS.join("|")})\\.`), "$1");
  return parsed.toString();
};

const ROBOTS_SELECTOR = 'head meta[name="robots"]';
const CANONICAL_SELECTOR = 'head link[rel="canonical"]';
const HREFLANG_SELECTOR = 'head link[rel="alternate"][hreflang]';

// Browser: net::ERR_CONNECTION_CLOSED…; fetch: ECONNRESET, UND_ERR_SOCKET (other side closed)…
const NETWORK_ERROR =
  /net::ERR_(CONNECTION_(CLOSED|RESET|REFUSED|TIMED_OUT)|EMPTY_RESPONSE)|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EPIPE|UND_ERR_|socket hang up|other side closed|fetch failed/;

// fetch Response → the same status() / url() / headers() calls as a Playwright response
const toResponse = (res) => {
  const headers = Object.fromEntries(res.headers);
  return { status: () => res.status, url: () => res.url, headers: () => headers };
};

/**
 * SEO checks of one page: status, redirect, robots, canonical, hreflang.
 *
 * Two modes, same check methods:
 * - HTTP (default for public pages): `SeoPage.request()` — the page HTML is fetched with Node
 *   fetch (no browser) and the SSR <head> is parsed. ~0.3–1.5 s per page instead of ~10 s and
 *   almost no CPU. Not Playwright `request` on purpose: Playwright traces its requests with the
 *   full HTML of every page, and the trace files fill the CI pod memory (OOMKilled on INT).
 * - Browser: `new SeoPage(page)` — for pages that need an authorized user or client rendering
 *   (create blog/post, own profile tabs, bookmarks).
 */
export class SeoPage {
  constructor(page = null) {
    this.isBrowser = page !== null;
    this.page = page;
    this.response = null;
    this.document = null;

    if (this.isBrowser) {
      this.metaRobots = this.page.locator(ROBOTS_SELECTOR);
      this.canonicalLink = this.page.locator(CANONICAL_SELECTOR);
      this.hreflangLinks = this.page.locator(HREFLANG_SELECTOR);
    }
  }

  // HTTP mode (public pages)
  static request() {
    return new SeoPage();
  }

  // `seoPage` lives in the describe closure until the worker exits — drop the parsed <head> too
  async close() {
    if (this.isBrowser) await this.page.close();
    this.document = null;
  }

  async fetchHtml(url, timeout) {
    const res = await fetch(url, {
      headers: { "user-agent": "UIAutotest", accept: "text/html,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(timeout)
    });
    const html = await res.text();
    this.response = toResponse(res);
    // SEO checks need only <head>; the body is the biggest part of the page
    const headEnd = html.search(/<\/head>/i);
    this.document = parse(headEnd === -1 ? html : html.slice(0, headEnd + "</head>".length));
    return this.response;
  }

  // Stage sometimes drops connections for a second or two (ERR_CONNECTION_CLOSED/RESET)
  // or leaves the request hanging without a response, so the request gets its own timeout
  // and is retried; 3 × 40 s still fits the 150 s hook timeout.
  // Only network errors and timeouts are retried — assertion failures are not affected.
  // Browser mode waits for "domcontentloaded" only: SEO checks read the response and the SSR <head>.
  async open(url, { attempts = 3, delayMs = 3000, timeout = 40000 } = {}) {
    for (let attempt = 1; ; attempt++) {
      try {
        if (this.isBrowser) {
          this.response = await this.page.goto(url, { timeout, waitUntil: "domcontentloaded" });
          return this.response;
        }
        return await this.fetchHtml(url, timeout);
      } catch (error) {
        // fetch puts the network error code into error.cause (ECONNRESET, UND_ERR_SOCKET…)
        const details = `${error.message} ${error.cause?.code ?? ""} ${error.cause?.message ?? ""}`;
        const isNetworkError = error.name === "TimeoutError" || /Timeout \d+ms exceeded/.test(details) || NETWORK_ERROR.test(details);
        if (!isNetworkError || attempt >= attempts) throw error;
        console.warn(`[SeoPage.open] ${details.split("\n")[0].trim()} — retry ${attempt}/${attempts - 1}`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  getStatusCode() {
    return this.response?.status() ?? null;
  }

  async checkStatusCode(expectedStatus = 200) {
    expect(this.response, "Page response is missing").not.toBeNull();
    expect(this.response.status()).toBe(expectedStatus);
  }

  // HTTP mode: url() of the response is the final URL after all server redirects.
  async checkUrlIsNotRedirected(expectedUrl) {
    if (this.isBrowser) {
      await expect(this.page).toHaveURL(expectedUrl);
    } else if (expectedUrl instanceof RegExp) {
      expect(this.response.url()).toMatch(expectedUrl);
    } else {
      expect(this.response.url()).toBe(expectedUrl);
    }
  }

  // [{ name: value }] of every node that matches the selector, from the DOM or the parsed HTML.
  async getAttributes(selector, names) {
    const pick = (node) => Object.fromEntries(names.map((name) => [name, node.getAttribute(name) ?? null]));
    if (this.isBrowser) {
      return this.page.locator(selector).evaluateAll(
        (nodes, attrNames) => nodes.map((node) => Object.fromEntries(attrNames.map((name) => [name, node.getAttribute(name)]))),
        names
      );
    }
    return this.document.querySelectorAll(selector).map(pick);
  }

  async getRobotsDirectives() {
    const metaContents = (await this.getAttributes(ROBOTS_SELECTOR, ["content"])).map(({ content }) => content || "");
    // Robots directives can also come in the X-Robots-Tag HTTP header (already in the response, no extra request)
    const headerContent = this.response?.headers()["x-robots-tag"] || "";

    return [...metaContents, headerContent]
      .join(",")
      .toLowerCase()
      .split(",")
      .map((directive) => directive.trim())
      .filter(Boolean);
  }

  async checkPageIsIndexable() {
    const directives = await this.getRobotsDirectives();
    expect(directives, `Robots directives: ${directives.join(", ")}`).not.toContain("noindex");
  }

  async checkPageIsNoindex() {
    const directives = await this.getRobotsDirectives();
    expect(directives, `Robots directives: ${directives.join(", ")}`).toContain("noindex");
  }

  async checkCanonicalLink(expectedUrl) {
    if (this.isBrowser) await expect(this.canonicalLink).toHaveCount(1);
    const canonicals = await this.getAttributes(CANONICAL_SELECTOR, ["href"]);
    expect(canonicals, "Canonical links").toHaveLength(1);
    expect(toProdUrl(canonicals[0].href)).toBe(expectedUrl);
  }

  async getHreflangs() {
    return this.getAttributes(HREFLANG_SELECTOR, ["hreflang", "href"]);
  }

  async checkHreflangs(expectedHreflangs) {
    const actual = await this.getHreflangs();
    const actualLangs = actual.map(({ hreflang }) => hreflang);

    expect(new Set(actualLangs).size, `Duplicated hreflang: ${actualLangs.join(", ")}`).toBe(actualLangs.length);
    expect(Object.fromEntries(actual.map(({ hreflang, href }) => [hreflang, toProdUrl(href)]))).toEqual(expectedHreflangs);
  }

  async checkHreflangsAreAbsent() {
    if (this.isBrowser) await expect(this.hreflangLinks).toHaveCount(0);
    else expect(await this.getHreflangs(), "Hreflang links").toHaveLength(0);
  }
}
