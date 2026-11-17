export const getBetReviewQuery = `
query PlatformQueries ($reviewID: ID!) {
    platformQueries {
        betReviewQueries {
            getBetReview(input: { reviewID: $reviewID }) {
                id
                entityID
                betPlatformType
                text
            }
        }
    }
}`;

export const getBetReviewsQuery = `
query PlatformQueries($entityID: String) {
    platformQueries {
        betReviewQueries {
            getBetReviews(input: { filters: { entityId: $entityID } }) {
                items {
                    id
                    entityID
                    betPlatformType
                    text
                }
            }
        }
    }
}`;

export const getBetReviewForWidgetQuery = `
fragment betReviewUser on User {
    id
    name
    avatar {
        webp(height: 60, width: 60, quality: 80)
    }
    location {
        country {
            name
            code
            picture(productType: SPORTSAPP, format: PNG) {
                webp(height: "60", width: "60", quality: 80)
            }
        }
    }
}
fragment CommentTopLevelFields on Comment {
    id
    text
    created
    threadId
    isDeleted
    edited
    isReplyToTopLevelComment
    objectClass
    objectId
    user {
        id
        name
        avatar {
            url
        }
        roles {
            ID
        }
    }
    reactions {
        userReaction {
            objectClass
            objectID
            reactionType
        }
        likeCount
        dislikeCount
    }
    parentComment {
        id
        isDeleted
        text
        created
        user {
            id
            name
        }
        reactions {
            likeCount
            dislikeCount
        }
    }
    threadComment {
        id
        user {
            id
            name
        }
    }
}
query getBetReviewForWidget($entityId: String!) {
    platformQueries {
        betReviewQueries {
            getBetReviews(
                input: {
                    filters: { approveStatus: APPROVED, entityId: $entityId }
                    feedOptions: { limit: 3 }
                    order: { forUser: true }
                }
            ) {
                items {
                    id
                    entityID
                    betPlatformType
                    reactions {
                        userReaction {
                            objectClass
                            objectID
                            reactionType
                        }
                        likeCount
                        dislikeCount
                    }
                    text
                    score
                    reviewStatus
                    likesDifference
                    created
                    user {
                        ...betReviewUser
                    }
                    commentsCount
                    topLevelComments(
                        input: { sort: NEWEST, pagination: { ByCursor: { first: 1 } } }
                    ) {
                        items {
                            ...CommentTopLevelFields
                        }
                        paginationInfo {
                            ... on PaginationByCursor {
                                totalItemsCount
                                hasNextPage
                                endCursor
                            }
                        }
                    }
                }
            }
        }
    }
}
`;

export const betReviewUserQuery = `
fragment betReviewUser on User {
    id
    name
    avatar {
        webp(height: 60, width: 60, quality: 80)
    }
    location {
        country {
            name
            code
            picture(productType: SPORTSAPP, format: PNG) {
                webp(height: "60", width: "60", quality: 80)
            }
        }
    }
}
query getBetReviewsList(
    $entityId: String!
    $currentPage: Int = 1
    $pageSize: Int = 30
) {
    platformQueries {
        betReviewQueries {
            getBetReviews(
                input: {
                    filters: { entityId: $entityId }
                    pagination: { ByPage: { page: $currentPage, pageSize: $pageSize } }
                    order: { forUser: true }
                }
            ) {
                items {
                    id
                    entityID
                    betPlatformType
                    reactions {
                        userReaction {
                            objectClass
                            objectID
                            reactionType
                        }
                        likeCount
                        dislikeCount
                    }
                    commentsCount
                    text
                    score
                    reviewStatus
                    likesDifference
                    created
                    user {
                        ...betReviewUser
                    }
                }
                paginationInfo {
                    ... on PaginationByPage {
                        totalItemsCount
                        lastPage
                        hasNextPage
                    }
                }
            }
        }
    }
}
`;