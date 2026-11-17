export const getLatestPostsQuery = `
query PostQueries {
    postQueries {
        feed(input: { sort: NEWEST, pagination: { ByCursor: { last: 10 } } }) {
            items {
                id
                title {
                    defaultValue
                }
            }
        }
    }
}`;

export const getCurrentUserPostsQuery = `
query PostQueries {
    postQueries {
        currentUserFeed(input: { pagination: { ByCursor: { last: 10 } } }) {
            items {
                id
                title {
                    defaultValue
                }
            }
        }
    }
}
`;

export const fetchPostsWithCommentsQuery = `
  query PostQueries {
    postQueries {
        feed(input: { pagination: { ByCursor: { first: 20 } } }) {
            items {
                id
                topLevelComments(input: { sort: NEWEST }) {
                    items {
                        id
                        text
                        application
                    }
                }
                commentsDisabled
            }
        }
    }
}`;
