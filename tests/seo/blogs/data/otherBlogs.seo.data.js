// Football / Other / Blogs tab (created from 11 content items) — Seo Type: Football - Other | Blogs (JSON-LD is not checked for now)
// Indexation: all languages except PT-BR, PL — yes; PT-BR, PL — noindex
// Hreflang: shared between projects, all languages where the page exists except PT-BR, PL, x-default — INT en

// "Other" tag with 11+ blogs from the SEO spreadsheet
export const blogsOtherHru = "rumours";

// "Other" tag without blogs per project (the tag exists on stage, the blogs tab is not created — 404)
// Blog counts differ between projects, so there is no single tag without blogs everywhere
export const noBlogsOtherHru = {
    UA: "var",
    BY: "var",
    INT: "football-ukraine"
};

// Same set on every language version of UA, BY and INT, urls on the prod domain
export const buildOtherBlogsHreflangs = (hru) => ({
    "x-default": `https://example.com/en/other/${hru}/blogs/`,
    en: `https://example.com/en/other/${hru}/blogs/`,
    de: `https://example.com/de/other/${hru}/blogs/`,
    fr: `https://example.com/fr/other/${hru}/blogs/`,
    it: `https://example.com/it/other/${hru}/blogs/`,
    es: `https://example.com/es/other/${hru}/blogs/`,
    ar: `https://example.com/ar/other/${hru}/blogs/`,
    uk: `https://ua.example.com/uk/football/other/${hru}/blogs/`,
    ru: `https://ua.example.com/football/other/${hru}/blogs/`,
    be: `https://by.example.com/be/football/other/${hru}/blogs/`,
    "ru-RU": `https://by.example.com/football/other/${hru}/blogs/`,
    "ru-BY": `https://by.example.com/football/other/${hru}/blogs/`,
    "ru-KZ": `https://by.example.com/football/other/${hru}/blogs/`
});

// Pages to open per project: path after BASE_URL
// INT pt-br and pl are "not yet published" in the SEO spreadsheet (the blogs tab returns 404 on stage)
export const otherBlogsPages = {
    UA: [
        { name: "ru", path: "football/other/%hru%/blogs/" },
        { name: "uk", path: "uk/football/other/%hru%/blogs/" }
    ],
    BY: [
        { name: "ru", path: "football/other/%hru%/blogs/" },
        { name: "be", path: "be/football/other/%hru%/blogs/" }
    ],
    INT: [
        { name: "en", path: "en/other/%hru%/blogs/" },
        { name: "de", path: "de/other/%hru%/blogs/" },
        { name: "fr", path: "fr/other/%hru%/blogs/" },
        { name: "it", path: "it/other/%hru%/blogs/" },
        { name: "es", path: "es/other/%hru%/blogs/" },
        { name: "ar", path: "ar/other/%hru%/blogs/" }
    ]
};
