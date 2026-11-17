// Main page — Static Seo Page, Seo Type: Main (JSON-LD is not checked for now)
// Indexation: yes
// Hreflang: explicit list from the SEO spreadsheet, shared between projects

// UA|BY main pages
export const uaByMainHreflangs = {
    uk: "https://ua.example.com/uk/",
    ru: "https://ua.example.com/",
    be: "https://by.example.com/be/",
    "ru-RU": "https://by.example.com/",
    "ru-BY": "https://by.example.com/",
    "ru-KZ": "https://by.example.com/"
};

// INT main pages and UA|BY "Football" pages (one set; the Football page imports it from here)
export const intMainHreflangs = {
    "x-default": "https://example.com/",
    en: "https://example.com/",
    de: "https://de.example.com/",
    es: "https://es.example.com/",
    fr: "https://fr.example.com/",
    it: "https://it.example.com/",
    ar: "https://ar.example.com/",
    "pt-BR": "https://pt-br.example.com/",
    pl: "https://pl.example.com/",
    uk: "https://ua.example.com/uk/football/",
    ru: "https://ua.example.com/football/",
    be: "https://by.example.com/be/football/",
    "ru-RU": "https://by.example.com/football/",
    "ru-BY": "https://by.example.com/football/",
    "ru-KZ": "https://by.example.com/football/"
};

// Pages to open per project: path after BASE_URL, subdomain — INT language versions (de.example.com)
export const mainPages = {
    UA: [
        { name: "ru", path: "", hreflangs: uaByMainHreflangs },
        { name: "uk", path: "uk/", hreflangs: uaByMainHreflangs }
    ],
    BY: [
        { name: "ru", path: "", hreflangs: uaByMainHreflangs },
        { name: "be", path: "be/", hreflangs: uaByMainHreflangs }
    ],
    INT: [
        { name: "en", subdomain: "", hreflangs: intMainHreflangs },
        { name: "de", subdomain: "de", hreflangs: intMainHreflangs },
        { name: "fr", subdomain: "fr", hreflangs: intMainHreflangs },
        { name: "it", subdomain: "it", hreflangs: intMainHreflangs },
        { name: "es", subdomain: "es", hreflangs: intMainHreflangs },
        { name: "ar", subdomain: "ar", hreflangs: intMainHreflangs },
        { name: "pt-br", subdomain: "pt-br", hreflangs: intMainHreflangs },
        { name: "pl", subdomain: "pl", hreflangs: intMainHreflangs }
    ]
};
// INT main page subfolders (example.com/de/) — Static Seo Page, Seo Type: Main
// Indexation: canonical to the matching subdomain (en — main domain), no indexation checks
// Hreflang: not checked — the page is canonicalized to the subdomain version
export const mainSubfolderPages = {
    INT: [
        { name: "en", path: "en/", canonical: "https://example.com/" },
        { name: "de", path: "de/", canonical: "https://de.example.com/" },
        { name: "fr", path: "fr/", canonical: "https://fr.example.com/" },
        { name: "it", path: "it/", canonical: "https://it.example.com/" },
        { name: "es", path: "es/", canonical: "https://es.example.com/" },
        { name: "ar", path: "ar/", canonical: "https://ar.example.com/" },
        { name: "pt-br", path: "pt-br/", canonical: "https://pt-br.example.com/" },
        { name: "pl", path: "pl/", canonical: "https://pl.example.com/" }
    ]
};
