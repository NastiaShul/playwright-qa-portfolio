export const getUsersBlogs = `
query BlogsQueries ($userID: ID!) {
    blogsQueries {
        ByUser(input: { userID: $userID }) {
            items {
                id
                title
                description
                foundationDate
                hru
                postsCount
                subscribersCount
                isBranded
                lastPostPublicationTime
                url
                languages
                accessibility
            }
        }
    }
}
`;

export const feedByCurrentUsersBlogs = `
query BlogsQueries {
    blogsQueries {
        feedByCurrentUser {
            id
            postsCount
            url
            languages
            title
        }
    }
}
`;