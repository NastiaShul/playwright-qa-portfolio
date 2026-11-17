// Betting projects: BT — bt.example.com (ru), BI — bi.example.com (INT languages).
// One SEO spreadsheet tab ("BI-ru|BI-int") covers both; hreflang links the two projects together.
//
// Unlike SportsApp, URL slugs are translated per language (/de/nachrichten/, /fr/actualites/…),
// so data files keep an explicit path per language: { ru: "news/", en: "news/", de: "nachrichten/", … }.

// prefix — language segment of the URL (ru on BT has no prefix), hreflang — value in <link hreflang>.
// pt-br and pl were published on BI stage in November 2026. Publications (news / posts) that are
// not translated into them simply have no "pt-br" / "pl" path in their data file.
export const seoLocalesBt = {
    BT: [{ lang: "ru", prefix: "", hreflang: "ru" }],
    BI: [
        { lang: "en", prefix: "en/", hreflang: "en" },
        { lang: "de", prefix: "de/", hreflang: "de" },
        { lang: "fr", prefix: "fr/", hreflang: "fr" },
        { lang: "it", prefix: "it/", hreflang: "it" },
        { lang: "es", prefix: "es/", hreflang: "es" },
        { lang: "ar", prefix: "ar/", hreflang: "ar" },
        { lang: "pt-br", prefix: "pt-br/", hreflang: "pt-BR" },
        { lang: "pl", prefix: "pl/", hreflang: "pl" }
    ]
};

// Prod domains — expected canonical/hreflang are always prod URLs (SeoPage drops "stage." from actual links).
export const seoProjectsBt = {
    BT: { origin: "https://bt.example.com/" },
    BI: { origin: "https://bi.example.com/" }
};

// x-default of every page with hreflang ("x-default - англ" in the spreadsheet header)
export const BT_X_DEFAULT_LANG = "en";

// BASE_URL → "BT" | "BI" | null (null — not a betting env: SportsApp runs skip all BT specs)
export const checkBettingProject = (baseUrl = "") => {
    if (baseUrl.includes("bi.example")) return "BI";
    if (baseUrl.includes("bt.example.com")) return "BT";
    return null;
};

// Locales of the current project; [] on a non-betting env
export const getBtLocales = (project) => seoLocalesBt[project] ?? [];

// paths — { lang: "path/without/language/" } from the data file; "%id%" is replaced with id
const pathFor = (paths, locale, id) => {
    const path = paths[locale.lang];
    if (path === undefined) throw new Error(`No path for "${locale.lang}" in the data file`);
    return path.replace("%id%", id);
};

// Page URL on the current env
export const buildBtUrl = (baseUrl, locale, paths, id = "") => `${baseUrl}${locale.prefix}${pathFor(paths, locale, id)}`;

// Same page on prod — expected value for canonical and hreflang
export const buildBtProdUrl = (project, locale, paths, id = "") =>
    buildBtUrl(seoProjectsBt[project].origin, locale, paths, id);

// "для всех языков": every published language of both projects + x-default → en.
// paths must contain a path for every published language (or langs restricts the set,
// e.g. a publication translated only into some languages).
// Pages with hreflang inside a group only (publication translations, one user's profile):
// groups — [["ru"], ["en", "de", …]]; a group of one language → no hreflang (null).
export const buildBtGroupHreflangs = (paths, groups, lang) => {
    const group = groups.find((langs) => langs.includes(lang)) ?? [lang];
    return group.length > 1 ? buildBtHreflangs(paths, { langs: group }) : null;
};

export const buildBtHreflangs =(paths, { id = "", langs = null, xDefault = BT_X_DEFAULT_LANG } = {}) => {
    const entries = Object.entries(seoLocalesBt).flatMap(([project, locales]) =>
        locales
            .filter((locale) => !langs || langs.includes(locale.lang))
            .map((locale) => ({ project, locale }))
    );
    const hreflangs = Object.fromEntries(
        entries.map(({ project, locale }) => [locale.hreflang, buildBtProdUrl(project, locale, paths, id)])
    );
    // x-default only when the set has its language (e.g. a publication without an en translation has none)
    const target = xDefault && entries.find(({ locale }) => locale.lang === xDefault);
    if (!target) return hreflangs;

    return { "x-default": buildBtProdUrl(target.project, target.locale, paths, id), ...hreflangs };
};
