import { test, expect } from "@playwright/test";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";
import { addSocialNetworkMutation } from "./userMutations.js";
import { getCurrentUserSocialNetworks } from "./userQueries.js";

const apiURL = process.env.API_URL;
const token = getAuthToken().user.token;

const networks = [
    { network_id: 'tw123', type: 'TWITTER' },
    { network_id: 'fb123', type: 'FACEBOOK' },
    { network_id: 'ig123', type: 'INSTAGRAM' },
    { network_id: 'tg123', type: 'TELEGRAM' },
    { network_id: 'yt123', type: 'YOUTUBE' },
    { network_id: 'tt123', type: 'TIKTOK' },
];

test("Add and verify user's social networks", async ({ request }, testInfo) => {
    const addNetworksResponse = await request.post(apiURL, {
        data: {
            query: addSocialNetworkMutation,
            variables: { socialNetworks: networks },
        },
        headers: {
            "X-Auth-Token": token,
        },
    });

    expect(addNetworksResponse.ok()).toBeTruthy();
    const addNetworksBody = await addNetworksResponse.json();
    testInfo.annotations.push({ type: 'response', description: addNetworksBody });

    const addUserNetworks = addNetworksBody?.data?.usersMutations?.addSocialNetwork;

    expect(addUserNetworks).toBeDefined();
    expect(addUserNetworks).toBe(true);

    const getUserNetworksResponse = await request.post(apiURL, {
        data: {
            query: getCurrentUserSocialNetworks,
        },
        headers: {
            "X-Auth-Token": token,
        },
    });

    expect(getUserNetworksResponse.ok()).toBeTruthy();
    const getUserNetworksResponseBody = await getUserNetworksResponse.json();
    testInfo.annotations.push({ type: 'response', description: getUserNetworksResponseBody });

    const userSocialNetworks = getUserNetworksResponseBody?.data?.userQueries?.current?.socialNetworks || [];

    expect(userSocialNetworks.length).toBeGreaterThanOrEqual(networks.length);

    networks.forEach(network => {
        const found = userSocialNetworks.find(n => n.network_id === network.network_id && n.type === network.type);
        expect(found).toBeDefined();
    });

});


test.afterEach(async ({ request }, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});