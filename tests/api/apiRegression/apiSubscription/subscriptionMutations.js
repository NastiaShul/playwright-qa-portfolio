export const favorMatchMutation = `
mutation FavorMatch($matchID: ID!) {
  userSubscriptionsMutations {
    favorMatch(input: { matchID: $matchID }) {
      success
    }
  }
}
`;

export const unfavorMatchMutation = `
mutation UnfavorMatch($matchID: ID!) {
  userSubscriptionsMutations {
    unfavorMatch(input: { matchID: $matchID }) {
      success
    }
  }
}
`;

export const subscribeToTagMutation = `
mutation UserSubscriptionsMutations($tagID: ID!) {
  userSubscriptionsMutations {
    subscribeToTag(input: { tagID: $tagID }) {
      subscribed
    }
  }
}
`;

export const unsubscriptionsMutations = `
mutation UserSubscriptionsMutations($tagID: ID!) {
    userSubscriptionsMutations {
        unsubscribeTag(input: { tagID: $tagID }) {
            unsubscribed
        }
    }
}`