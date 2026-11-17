// Football / News — Seo Type: none
// Indexation: noindex if no body, no title, published before 2010, external link, 30 words or less
// Hreflang (indexed news only):
//   UA — separately, if published in 2 languages (ru, uk), no x-default
//   BY — separately, if published in 2 languages (ru → ru-RU, ru-BY, ru-KZ; be), no x-default
//   INT — languages the news is published in, x-default — en if there is an en version, otherwise none
//   UA|BY — news shared between UA and BY: ru, uk, be, ru-BY, ru-RU, ru-KZ, no x-default
// Not covered yet (no test data on stage): noindex states
// INT pt-br, pl — not published yet, not checked

// UA news in 2 languages from the SEO spreadsheet
const uaHru = "1000000374251-trubinym-dovoli-predmetno-tsikavyvsya-lids-mykhaylo-spiv";

// BY news in 2 languages from the SEO spreadsheet
const byHru = "1113088176-valeryj-bacharou-lyavonau-chasta-zaxodzicz-u-razdzyavalnyu";

// News shared between UA and BY, exists on stage: each project has its own id and hru
const sharedUaHru = "1000000387681-barselonu-oshtrafuvaly-na-602-yevro-za-pozovom-atletiko";
const sharedByHru = "1113094310-barselonu-ashtrafavali-na-602-eura-pa-pazove-atletyka-zza-s";
// INT news with an en version from the SEO spreadsheet: path per language
const intWithEnPaths = {
    en: "en/news/2026-09-06-dimarco-remains-a-doubt-for-real-madrid-clash-despite-encouraging-injury-update/",
    de: "de/news/2026-09-07-federico-dimarco-bleibt-fur-das-duell-gegen-real-madrid-fraglich-positive-nachrichten-zu/",
    fr: "fr/news/2026-09-06-dimarco-reste-incertain-pour-le-choc-face-au-real-madrid-malgre-des-nouvelles-rassurantes/",
    it: "it/news/2026-09-06-dimarco-e-linfortunio-al-ginocchio-le-prime-sensazioni-sullo-stop-dellesterno-dellinter/",
    es: "es/news/2026-09-06-dimarco-sigue-siendo-duda-para-el-choque-ante-el-real-madrid-a-pesar-de-una-noticia-alent/",
    ar: "ar/news/2026-09-06-dy-mrkw-wsb-lrkb-wl-lntbt-hwl-twqf-jnh-lntr/"
};

// INT news without an en version (ar, es), exists on stage
const intWithoutEnPaths = {
    es: "es/news/2026-10-29-el-barcelona-femenino-aplasta-por-08-al-hb-koge-con-una-exhibicion-ofensiva-en-dinamarca/",
    ar: "ar/news/2026-10-30-brshlwn-llsydt-yshq-tsh-by-kwjy-08-brd-hjwmy-mdhhl-fy-ldnmrk/"
};

const intProdUrl = (path) => `https://example.com/${path}`;

// Expected hreflangs per state, urls on the prod domain
const uaHreflangs = {
    ru: `https://ua.example.com/football/${uaHru}/`,
    uk: `https://ua.example.com/uk/football/${uaHru}/`
};

const byHreflangs = {
    be: `https://by.example.com/be/football/${byHru}/`,
    "ru-RU": `https://by.example.com/football/${byHru}/`,
    "ru-BY": `https://by.example.com/football/${byHru}/`,
    "ru-KZ": `https://by.example.com/football/${byHru}/`
};

const sharedUaByHreflangs = {
    ru: `https://ua.example.com/football/${sharedUaHru}/`,
    uk: `https://ua.example.com/uk/football/${sharedUaHru}/`,
    be: `https://by.example.com/be/football/${sharedByHru}/`,
    "ru-RU": `https://by.example.com/football/${sharedByHru}/`,
    "ru-BY": `https://by.example.com/football/${sharedByHru}/`,
    "ru-KZ": `https://by.example.com/football/${sharedByHru}/`
};

const intWithEnHreflangs = {
    "x-default": intProdUrl(intWithEnPaths.en),
    ...Object.fromEntries(Object.entries(intWithEnPaths).map(([lang, path]) => [lang, intProdUrl(path)]))
};

const intWithoutEnHreflangs = Object.fromEntries(
    Object.entries(intWithoutEnPaths).map(([lang, path]) => [lang, intProdUrl(path)])
);

const toPages = (paths) => Object.entries(paths).map(([name, path]) => ({ name, path }));

// States to check per project: pages to open (path after BASE_URL) and the hreflang set shared by them
// hreflangBug — bug reason, the hreflang test is marked with test.fail
export const footballNewsArticleStates = {
    UA: [
        {
            name: "News in 2 languages",
            pages: [
                { name: "ru", path: `football/${uaHru}/` },
                { name: "uk", path: `uk/football/${uaHru}/` }
            ],
            hreflangs: uaHreflangs
        },
        {
            name: "News shared between UA and BY",
            pages: [
                { name: "ru", path: `football/${sharedUaHru}/` },
                { name: "uk", path: `uk/football/${sharedUaHru}/` }
            ],
            hreflangs: sharedUaByHreflangs
        }
    ],
    BY: [
        {
            name: "News in 2 languages",
            pages: [
                { name: "ru", path: `football/${byHru}/` },
                { name: "be", path: `be/football/${byHru}/` }
            ],
            hreflangs: byHreflangs
        },
        {
            name: "News shared between UA and BY",
            pages: [
                { name: "ru", path: `football/${sharedByHru}/` },
                { name: "be", path: `be/football/${sharedByHru}/` }
            ],
            hreflangs: sharedUaByHreflangs
        }
    ],
    INT: [
        {
            name: "News with en version",
            pages: toPages(intWithEnPaths),
            hreflangs: intWithEnHreflangs,
            hreflangBug: "Bug: no x-default hreflang on INT news with en version (known issue, no ticket yet)"
        },
        { name: "News without en version", pages: toPages(intWithoutEnPaths), hreflangs: intWithoutEnHreflangs }
    ]
};
