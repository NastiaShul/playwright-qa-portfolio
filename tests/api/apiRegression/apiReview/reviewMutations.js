export const createReviewMutation = `
mutation CreateReview($score: Int!, $text: String!, $betPlatformType: BetPlatformType!, $entityID: ID!) {
    platformMutations {
        betReviewMutations {
            createReview(
                input: {
                    score: $score
                    text: $text
                    betPlatformType: $betPlatformType
                    entityID: $entityID
                }
            ) {
                id
            }
        }
    }
}`;

export const removeReviewMutation = `
mutation RemoveReview($id: ID!) {
    platformMutations {
        betReviewMutations {
            removeReview(id: $id)
        }
    }
}
`;