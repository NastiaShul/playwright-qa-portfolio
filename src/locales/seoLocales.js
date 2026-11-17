import fs from "fs";

// SportsApp language versions.
// prefix — language segment of the URL (ru has no prefix),
// hreflangs — hreflang values that point to this version on pages of one project (profile, tabs, blogs…).
// Pages shared between projects (main page, tags, sports) use explicit hreflang lists from the spreadsheet.
export const seoLocales = {
  UA: [
    { lang: "ru", prefix: "", hreflangs: ["ru"] },
    { lang: "uk", prefix: "uk/", hreflangs: ["uk"] }
  ],
  BY: [
    { lang: "ru", prefix: "", hreflangs: ["ru"] },
    { lang: "be", prefix: "be/", hreflangs: ["be"] }
  ],
  INT: [
    { lang: "en", prefix: "en/", hreflangs: ["en"] },
    { lang: "de", prefix: "de/", hreflangs: ["de"] },
    { lang: "fr", prefix: "fr/", hreflangs: ["fr"] },
    { lang: "it", prefix: "it/", hreflangs: ["it"] },
    { lang: "es", prefix: "es/", hreflangs: ["es"] },
    { lang: "ar", prefix: "ar/", hreflangs: ["ar"] },
    { lang: "pt-br", prefix: "pt-br/", hreflangs: ["pt-BR"] },
    { lang: "pl", prefix: "pl/", hreflangs: ["pl"] }
  ]
};

// Prod domains — expected canonical/hreflang are always prod URLs (SeoPage drops "stage." from actual links).
export const seoProjects = {
  UA: { origin: "https://ua.example.com/" },
  BY: { origin: "https://by.example.com/" },
  INT: { origin: "https://example.com/" }
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// template without language and leading slash: "profile/%id%/"
export const buildSeoUrl = (baseUrl, locale, template, id = "") =>
  `${baseUrl}${locale.prefix}${template.replace("%id%", id)}`;

// Same page on the prod domain — expected value for canonical and hreflang
export const buildProdUrl = (project, locale, template, id = "") =>
  buildSeoUrl(seoProjects[project].origin, locale, template, id);

// For pages where the app substitutes %id% after navigation (e.g. /blogs/create-post/)
export const buildSeoUrlPattern = (baseUrl, locale, template) => {
  const [before, after] = template.split("%id%");
  return new RegExp(`^${escapeRegExp(`${baseUrl}${locale.prefix}${before}`)}[^/]+${escapeRegExp(after)}$`);
};

// For pages whose language versions are subdomains (INT main page: de.example.com, de.stage.example.com)
export const buildSubdomainUrl = (baseUrl, subdomain = "", path = "") =>
  `${subdomain ? baseUrl.replace("://", `://${subdomain}.`) : baseUrl}${path}`;

// Hreflang is rendered per project only: { "x-default": url, ru: url, uk: url } — urls on the prod domain.
// xDefault — language x-default points to (differs per page, see the data file); null — x-default must be absent.
export const buildExpectedHreflangs = (project, template, id = "", xDefault = null) => {
  const locales = seoLocales[project];
  const hreflangs = Object.fromEntries(
    locales.flatMap((locale) =>
      locale.hreflangs.map((hreflang) => [hreflang, buildProdUrl(project, locale, template, id)])
    )
  );

  if (!xDefault) return hreflangs;

  const xDefaultLocale = locales.find(({ lang }) => lang === xDefault);
  return { "x-default": buildProdUrl(project, xDefaultLocale, template, id), ...hreflangs };
};

// The file is created on login, so read it at test time, not on import
export const getUserId = (role) => {
  const authTokens = JSON.parse(fs.readFileSync("auth-token.json", "utf-8"));
  return authTokens[role].userId;
};