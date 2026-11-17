import { REST_API_URL } from "../apiVariables";

const firebaseSigninMutation = `
    mutation AuthMutations($idToken: String!) {
        authMutations {
            firebaseSignin(idToken: $idToken, signinType: EMAIL_PASSWORD) {
                session {
                    token
                    user {
                        id
                    }
                }
            }
        }
    }
`;

// restUrl / apiUrl — Firebase sign-in and GraphQL of the project (SportsApp by default, betting passes its own)
export async function authenticate(request, email, password, { restUrl = REST_API_URL, apiUrl = process.env.API_URL } = {}) {
    const restResponse = await request.post(restUrl, {
        data: {
            returnSecureToken: true,
            email,
            password,
            clientType: "CLIENT_TYPE_WEB",
        },
    });

    const restRaw = await restResponse.text();
    if (!restResponse.ok()) {
        throw new Error(
            `❌ REST auth failed with status ${restResponse.status()}:\n${restRaw}`
        );
    }

    let restResponseBody;
    try {
        restResponseBody = JSON.parse(restRaw);
    } catch {
        throw new Error(
            `❌ Failed to parse REST auth response as JSON.\nResponse was:\n${restRaw}`
        );
    }

    const graphqlResponse = await request.post(apiUrl, {
        data: {
            query: firebaseSigninMutation,
            variables: { idToken: restResponseBody.idToken },
        },
        headers: { "Content-Type": "application/json" },
    });

    const gqlRaw = await graphqlResponse.text();
    if (!graphqlResponse.ok()) {
        throw new Error(
            `❌ GraphQL request failed with status ${graphqlResponse.status()}:\n${gqlRaw}`
        );
    }

    let graphqlResponseBody;
    try {
        graphqlResponseBody = JSON.parse(gqlRaw);
    } catch {
        throw new Error(
            `❌ Failed to parse GraphQL response as JSON.\nResponse was:\n${gqlRaw}`
        );
    }

    const userId =
        graphqlResponseBody?.data?.authMutations?.firebaseSignin?.session?.user?.id;
    const token =
        graphqlResponseBody?.data?.authMutations?.firebaseSignin?.session?.token;

    if (!userId || !token) {
        throw new Error(
            `❌ Authentication response missing userId or token.\nFull body:\n${JSON.stringify(
                graphqlResponseBody,
                null,
                2
            )}`
        );
    }

    return { "X-Auth-Token": token, userId };
}