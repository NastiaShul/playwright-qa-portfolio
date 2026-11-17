// Football / Other / Blogs tab — pagination — Seo Type: Football - Other | Blogs
// Indexation: all languages except PT-BR, PL — canonical to the blogs tab (/blogs/)
// Hreflang: none
// INT pt-br, pl — not published yet, not checked

// "Other" tag with several pages of blogs from the SEO spreadsheet
export const paginatedBlogsOtherHru = "rumours";

// Pages to open per project: path after BASE_URL, canonical — path of the blogs tab on the prod domain
export const otherBlogsPaginationPages = {
    UA: [
        { name: "ru", path: "football/other/%hru%/blogs/page2/", canonical: "https://ua.example.com/football/other/%hru%/blogs/" },
        { name: "uk", path: "uk/football/other/%hru%/blogs/page2/", canonical: "https://ua.example.com/uk/football/other/%hru%/blogs/" }
    ],
    BY: [
        { name: "ru", path: "football/other/%hru%/blogs/page2/", canonical: "https://by.example.com/football/other/%hru%/blogs/" },
        { name: "be", path: "be/football/other/%hru%/blogs/page2/", canonical: "https://by.example.com/be/football/other/%hru%/blogs/" }
    ],
    INT: [
        { name: "en", path: "en/other/%hru%/blogs/page2/", canonical: "https://example.com/en/other/%hru%/blogs/" },
        { name: "de", path: "de/other/%hru%/blogs/page2/", canonical: "https://example.com/de/other/%hru%/blogs/" },
        { name: "fr", path: "fr/other/%hru%/blogs/page2/", canonical: "https://example.com/fr/other/%hru%/blogs/" },
        { name: "it", path: "it/other/%hru%/blogs/page2/", canonical: "https://example.com/it/other/%hru%/blogs/" },
        { name: "es", path: "es/other/%hru%/blogs/page2/", canonical: "https://example.com/es/other/%hru%/blogs/" },
        { name: "ar", path: "ar/other/%hru%/blogs/page2/", canonical: "https://example.com/ar/other/%hru%/blogs/" }
    ]
};
