export const newsQuery = `
    query NewsQueries {
        newsQueries {
            feed(input: { pagination: { ByCursor: { first: 3 } } }) {
                items {
                    id
                    commentsDisabled
                }
            }
        }
    }
`;


export const fetchNewsWithCommentsQuery = `
query NewsQueries {
    newsQueries {
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
