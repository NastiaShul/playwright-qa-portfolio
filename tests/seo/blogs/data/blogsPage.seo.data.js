// All sports / Blogs feed — Seo Type: none
// Indexation: yes
// Hreflang: only for UA|BY (ru, uk, be, ru-RU, ru-BY, ru-KZ), shared between projects, no x-default

// UA|BY blogs feed pages
export const uaByBlogsHreflangs = {
    uk: "https://ua.example.com/uk/blogs/",
    ru: "https://ua.example.com/blogs/",
    be: "https://by.example.com/be/blogs/",
    "ru-RU": "https://by.example.com/blogs/",
    "ru-BY": "https://by.example.com/blogs/",
    "ru-KZ": "https://by.example.com/blogs/"
};

// Pages to open per project: path after BASE_URL. INT is not covered by the SEO spreadsheet
export const blogsPages = {
    UA: [
        { name: "ru", path: "blogs/", hreflangs: uaByBlogsHreflangs },
        { name: "uk", path: "uk/blogs/", hreflangs: uaByBlogsHreflangs }
    ],
    BY: [
        { name: "ru", path: "blogs/", hreflangs: uaByBlogsHreflangs },
        { name: "be", path: "be/blogs/", hreflangs: uaByBlogsHreflangs }
    ]
};
