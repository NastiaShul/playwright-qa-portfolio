export const firebaseSigninMutation = `
    mutation AuthMutations($idToken: String!) {
        authMutations {
            firebaseSignin(idToken: $idToken, signinType: EMAIL_PASSWORD) {
                session {
                    token
                }
            }
        }
    }
`;