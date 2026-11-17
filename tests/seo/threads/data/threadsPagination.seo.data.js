// All sports / Threads list — pagination
// Indexation: noindex
// Hreflang: none, no x-default

// Second pagination page from the SEO spreadsheet (/threads/page#/). INT language versions are subfolders (example.com/de/threads/page2/)
// INT pt-br and pl are "not yet published" in the SEO spreadsheet (page 2 returns 404 on stage)
export const threadsPaginationPages = {
    UA: [
        { name: "ru", path: "threads/page2/" },
        { name: "uk", path: "uk/threads/page2/" }
    ],
    BY: [
        { name: "ru", path: "threads/page2/" },
        { name: "be", path: "be/threads/page2/" }
    ],
    INT: [
        { name: "en", path: "en/threads/page2/" },
        { name: "de", path: "de/threads/page2/" },
        { name: "fr", path: "fr/threads/page2/" },
        { name: "it", path: "it/threads/page2/" },
        { name: "es", path: "es/threads/page2/" },
        { name: "ar", path: "ar/threads/page2/" }
    ]
};
