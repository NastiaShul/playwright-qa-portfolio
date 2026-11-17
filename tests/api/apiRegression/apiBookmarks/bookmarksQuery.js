export const getCurrentUserBookmarksOnNews = `
query BookmarkQueries {
    bookmarkQueries {
        currentUserBookmarks(input: { pagination: { ByCursor: { last: 100 } } }) {
            bookmarks {
                ... on News {
                    id
                    title {
                        defaultValue
                    }
                }
            }
        }
    }
}
`;

export const getCurrentUserBookmarksOnPost = `
query BookmarkQueries {
    bookmarkQueries {
        currentUserBookmarks(input: { pagination: { ByCursor: { last: 100 } } }) {
            bookmarks {
                ... on Post {
                    id
                    title {
                        defaultValue
                    }
                }
            }
        }
    }
}
`;

export const getCurrentUserBookmarksOnPoll = `
query BookmarkQueries {
    bookmarkQueries {
        currentUserBookmarks(input: { pagination: { ByCursor: { last: 100 } } }) {
            bookmarks {
                ... on CustomPoll {
                    id
                    title {
                        defaultValue
                    }
                }
            }
        }
    }
}
`;