export const deleteUserMutation = `
    mutation AdminMutations($userId: ID!) {
        adminMutations {
            userMutations {
                clearUserData(
                    input: {
                        ClearAllUserData: true
                        UserIDToClear: $userId
                    }
                )
            }
        }
    }
`;

export const addSocialNetworkMutation = `
mutation addSocialNetwork($socialNetworks: [AddSocialNetwork!]!) {
    usersMutations {
        addSocialNetwork(input: { socialNetworks: $socialNetworks })
    }
}
`;