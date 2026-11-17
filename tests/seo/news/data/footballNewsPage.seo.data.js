// Football / News feed — Seo Type: News
// Indexation: yes
// Hreflang: shared between all projects (UA, BY, INT), x-default — INT en

// Shared football news feed hreflangs across all projects
export const footballNewsHreflangs = {
    "x-default": "https://example.com/en/news/",
    en: "https://example.com/en/news/",
    de: "https://example.com/de/news/",
    fr: "https://example.com/fr/news/",
    it: "https://example.com/it/news/",
    es: "https://example.com/es/news/",
    ar: "https://example.com/ar/news/",
    "pt-BR": "https://example.com/pt-br/news/",
    pl: "https://example.com/pl/news/",
    uk: "https://ua.example.com/uk/football/news/",
    ru: "https://ua.example.com/football/news/",
    be: "https://by.example.com/be/football/news/",
    "ru-BY": "https://by.example.com/football/news/",
    "ru-RU": "https://by.example.com/football/news/",
    "ru-KZ": "https://by.example.com/football/news/"
};

// Pages to open per project: path after BASE_URL
export const footballNewsPages = {
    UA: [
        { name: "ru", path: "football/news/", hreflangs: footballNewsHreflangs },
        { name: "uk", path: "uk/football/news/", hreflangs: footballNewsHreflangs }
    ],
    BY: [
        { name: "ru", path: "football/news/", hreflangs: footballNewsHreflangs },
        { name: "be", path: "be/football/news/", hreflangs: footballNewsHreflangs }
    ],
    INT: [
        { name: "en", path: "en/news/", hreflangs: footballNewsHreflangs },
        { name: "de", path: "de/news/", hreflangs: footballNewsHreflangs },
        { name: "fr", path: "fr/news/", hreflangs: footballNewsHreflangs },
        { name: "it", path: "it/news/", hreflangs: footballNewsHreflangs },
        { name: "es", path: "es/news/", hreflangs: footballNewsHreflangs },
        { name: "ar", path: "ar/news/", hreflangs: footballNewsHreflangs },
        { name: "pt-br", path: "pt-br/news/", hreflangs: footballNewsHreflangs },
        { name: "pl", path: "pl/news/", hreflangs: footballNewsHreflangs }
    ]
};
