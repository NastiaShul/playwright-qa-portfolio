export const getMatchSubscriptionQuery = `
    query GetMatchSubscription($id: ID!) {
    stat {
        __typename
        football {
            __typename
            stat_match(id: $id) {
                __typename
                isUserSubscribed
            }
        }
    }
}
`;

export const currentUserFavMatchesQuery = `
query UserSubscriptionsQueries {
    userSubscriptionsQueries {
        currentUserFavMatches(input: { pagination: { ByCursor: { last: 100 } } }) {
            favMatches {
                matchID
                scheduledAt
            }
        }
    }
}`;

export const getFavMatchesByIDsQuery = `
  query UserSubscriptionsQueries($matchIDs: [ID!]!) {
    userSubscriptionsQueries {
      getFavMatchesByIDs(input: { matchIDs: $matchIDs }) {
        ids
      }
    }
  }
`;

export const currentUserSubs = `
query UserSubscriptionsQueries {
    userSubscriptionsQueries {
        currentUserSubs(input: { pagination: { ByCursor: { last: null } } }) {
            subscriptions {
                entityID
                entityType
                isPushesEnabled
            }
        }
    }
}
`;

