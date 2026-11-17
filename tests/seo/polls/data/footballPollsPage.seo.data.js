// Football / Polls list — Seo Type: none
// Indexation: yes
// Hreflang: all languages, shared between projects, x-default — INT en

export const footballPollsHreflangs = {
    "x-default": "https://example.com/en/polls/",
    uk: "https://ua.example.com/uk/football/polls/",
    ru: "https://ua.example.com/football/polls/",
    be: "https://by.example.com/be/football/polls/",
    "ru-RU": "https://by.example.com/football/polls/",
    "ru-BY": "https://by.example.com/football/polls/",
    "ru-KZ": "https://by.example.com/football/polls/",
    en: "https://example.com/en/polls/",
    de: "https://example.com/de/polls/",
    fr: "https://example.com/fr/polls/",
    it: "https://example.com/it/polls/",
    es: "https://example.com/es/polls/",
    ar: "https://example.com/ar/polls/",
    "pt-BR": "https://example.com/pt-br/polls/",
    pl: "https://example.com/pl/polls/"
};

// Pages to open per project: path after BASE_URL. UA|BY — /football/polls/, INT — /{lang}/polls/ (subfolders)
export const footballPollsPages = {
    UA: [
        { name: "ru", path: "football/polls/", hreflangs: footballPollsHreflangs },
        { name: "uk", path: "uk/football/polls/", hreflangs: footballPollsHreflangs }
    ],
    BY: [
        { name: "ru", path: "football/polls/", hreflangs: footballPollsHreflangs },
        { name: "be", path: "be/football/polls/", hreflangs: footballPollsHreflangs }
    ],
    INT: [
        { name: "en", path: "en/polls/", hreflangs: footballPollsHreflangs },
        { name: "de", path: "de/polls/", hreflangs: footballPollsHreflangs },
        { name: "fr", path: "fr/polls/", hreflangs: footballPollsHreflangs },
        { name: "it", path: "it/polls/", hreflangs: footballPollsHreflangs },
        { name: "es", path: "es/polls/", hreflangs: footballPollsHreflangs },
        { name: "ar", path: "ar/polls/", hreflangs: footballPollsHreflangs },
        { name: "pt-br", path: "pt-br/polls/", hreflangs: footballPollsHreflangs },
        { name: "pl", path: "pl/polls/", hreflangs: footballPollsHreflangs }
    ]
};
