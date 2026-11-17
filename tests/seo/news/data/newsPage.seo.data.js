// All sports / News feed — Seo Type: none
// Indexation: yes
// Hreflang: only for UA|BY (ru, uk, be, ru-RU, ru-BY, ru-KZ), shared between projects, no x-default

// UA|BY news feed pages
export const uaByNewsHreflangs = {
    uk: "https://ua.example.com/uk/news/",
    ru: "https://ua.example.com/news/",
    be: "https://by.example.com/be/news/",
    "ru-RU": "https://by.example.com/news/",
    "ru-BY": "https://by.example.com/news/",
    "ru-KZ": "https://by.example.com/news/"
};

// Pages to open per project: path after BASE_URL. INT is not covered by the SEO spreadsheet
export const newsPages = {
    UA: [
        { name: "ru", path: "news/", hreflangs: uaByNewsHreflangs },
        { name: "uk", path: "uk/news/", hreflangs: uaByNewsHreflangs }
    ],
    BY: [
        { name: "ru", path: "news/", hreflangs: uaByNewsHreflangs },
        { name: "be", path: "be/news/", hreflangs: uaByNewsHreflangs }
    ]
};
