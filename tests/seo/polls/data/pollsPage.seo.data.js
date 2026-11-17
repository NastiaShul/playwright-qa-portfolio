// All sports / Polls list — Seo Type: none
// Indexation: yes
// Hreflang: only for UA|BY (ru, uk, be, ru-RU, ru-BY, ru-KZ), shared between projects, no x-default

// UA|BY polls list pages
export const uaByPollsHreflangs = {
    uk: "https://ua.example.com/uk/polls/",
    ru: "https://ua.example.com/polls/",
    be: "https://by.example.com/be/polls/",
    "ru-RU": "https://by.example.com/polls/",
    "ru-BY": "https://by.example.com/polls/",
    "ru-KZ": "https://by.example.com/polls/"
};

// Pages to open per project: path after BASE_URL. INT is not covered by the SEO spreadsheet
export const pollsPages = {
    UA: [
        { name: "ru", path: "polls/", hreflangs: uaByPollsHreflangs },
        { name: "uk", path: "uk/polls/", hreflangs: uaByPollsHreflangs }
    ],
    BY: [
        { name: "ru", path: "polls/", hreflangs: uaByPollsHreflangs },
        { name: "be", path: "be/polls/", hreflangs: uaByPollsHreflangs }
    ]
};
