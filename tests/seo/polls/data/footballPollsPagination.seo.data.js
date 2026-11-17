// Football / Polls list — pagination
// Indexation: canonical to the football polls list (/football/polls/)
// Hreflang: none

// Second pagination page from the SEO spreadsheet. UA — /football/polls/page#/, INT — /{lang}/polls/page#/ (subfolders)
// Canonical points to the first page of the polls list on the same language version (prod domain)
// INT pt-br and pl are "not yet published" in the SEO spreadsheet
// BY is not covered: page 2 returns 404 on stage (not enough polls)
export const footballPollsPaginationPages = {
    UA: [
        { name: "ru", path: "football/polls/page2/", canonical: "https://ua.example.com/football/polls/" },
        { name: "uk", path: "uk/football/polls/page2/", canonical: "https://ua.example.com/uk/football/polls/" }
    ],
    INT: [
        { name: "en", path: "en/polls/page2/", canonical: "https://example.com/en/polls/" },
        { name: "de", path: "de/polls/page2/", canonical: "https://example.com/de/polls/" },
        { name: "fr", path: "fr/polls/page2/", canonical: "https://example.com/fr/polls/" },
        { name: "it", path: "it/polls/page2/", canonical: "https://example.com/it/polls/" },
        { name: "es", path: "es/polls/page2/", canonical: "https://example.com/es/polls/" },
        { name: "ar", path: "ar/polls/page2/", canonical: "https://example.com/ar/polls/" }
    ]
};
