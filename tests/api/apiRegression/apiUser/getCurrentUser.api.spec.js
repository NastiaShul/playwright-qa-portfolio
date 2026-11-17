import { test, expect } from "@playwright/test";
import { getCurrentUser } from "./userQueries.js";
import { getAuthToken } from "../../utils/functions/getAuthToken.js";

const apiURL = process.env.API_URL;
const token = await getAuthToken().admin.token;
  
test("Check if Current User query works", async ({ request }, testInfo) => {
    const headers = { "X-Auth-Token": token};

        const response = await request.post(apiURL, {
          data: {
            query: getCurrentUser,
          }, 
          headers
        });
    
        const responseBody = await response.json();
        
        testInfo.annotations.push({ type: 'response', description: responseBody }); 
    
        expect(responseBody.errors).toBeUndefined();
        expect(responseBody.data?.userQueries?.current).toBeDefined();

        const user = responseBody.data.userQueries.current;
        expect(user.id).toBeDefined();
        expect(typeof user.id).toBe('string');

        expect(user.avatar).toBeDefined();
        expect(typeof user.avatar === 'object' || user.avatar === null).toBe(true);
        if(user.avatar !== null) {
            expect(user.avatar).toHaveProperty('url');
            expect(typeof user.avatar.url).toBe('string');
            expect(user.avatar).toHaveProperty('resize');
            expect(typeof user.avatar.resize === 'string' || user.avatar.resize === null).toBe(true);
        }

        expect(user.banned).toBeDefined();
        expect(typeof user.banned === 'object' || user.banned === null).toBe(true);
        if(user.banned !== null){
            expect(user.banned).toHaveProperty('type');
            expect(typeof user.banned.type).toBe('string');
            expect(user.banned).toHaveProperty('until');
        }

        expect(user.name).toBeDefined();
        expect(typeof user.name).toBe('string');

        expect(user.bio).toBeDefined();
        expect(typeof user.bio === 'string' || user.bio === null).toBe(true);

        expect(user.roles).toBeDefined();
        expect(Array.isArray(user.roles)).toBe(true);
        user.roles.forEach(roleObj => {
        expect(roleObj).toHaveProperty('ID');
        expect(typeof roleObj.ID).toBe('string');
        });

        expect(user.currentAuthProvider).toBeDefined();
        expect(typeof user.currentAuthProvider).toBe('string');
});

test.afterEach(async ({}, testInfo) => {
    if (testInfo.status !== 'passed' && testInfo.annotations.some(a => a.type === 'response')) {
        console.log(`❌ Test failed: ${testInfo.title}`);
        console.log(`📩 Response: ${JSON.stringify(testInfo.annotations.find(a => a.type === 'response').description, null, 2)}`);
    }
});