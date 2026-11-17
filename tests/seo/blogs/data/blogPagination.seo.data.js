// All sports / Blog — pagination (task for Community Team)
// Indexation: canonical to the blog main page (/blogs/%hru%/)
// Hreflang: none
// INT pt-br, pl — not published yet, not checked

// Second pagination page from the SEO spreadsheet (/blogs/%hru%/page#/)
export const blogPaginationTemplate = "blogs/%id%/page2/";

// Canonical points to the first page of the blog on the same language version
export const blogPaginationCanonicalTemplate = "blogs/%id%/";

// Blogs with several pages of posts from the SEO spreadsheet (exist on stage)
export const paginatedBlogHrus = {
    UA: "dynamonline",
    BY: "fullfootballmatches",
    INT: "_don039t-touch-my-paella"
};

export const unpublishedLocales = ["pt-br", "pl"];
