// Football / News feed — pagination
// Indexation: canonical to the football news feed (/football/news/ or /news/)
// Hreflang: none

// Second pagination page from the SEO spreadsheet
// Canonical points to the first page of the football news feed on the same language version (prod domain)
// INT pt-br, pl are not covered: not published yet
export const footballNewsPaginationPages = {
    UA: [
        { name: "ru", path: "football/news/page2/", canonical: "https://ua.example.com/football/news/" },
        { name: "uk", path: "uk/football/news/page2/", canonical: "https://ua.example.com/uk/football/news/" }
    ],
    BY: [
        { name: "ru", path: "football/news/page2/", canonical: "https://by.example.com/football/news/" },
        { name: "be", path: "be/football/news/page2/", canonical: "https://by.example.com/be/football/news/" }
    ],
    INT: [
        { name: "en", path: "en/news/page2/", canonical: "https://example.com/en/news/" },
        { name: "de", path: "de/news/page2/", canonical: "https://example.com/de/news/" },
        { name: "fr", path: "fr/news/page2/", canonical: "https://example.com/fr/news/" },
        { name: "it", path: "it/news/page2/", canonical: "https://example.com/it/news/" },
        { name: "es", path: "es/news/page2/", canonical: "https://example.com/es/news/" },
        { name: "ar", path: "ar/news/page2/", canonical: "https://example.com/ar/news/" }
    ]
};
