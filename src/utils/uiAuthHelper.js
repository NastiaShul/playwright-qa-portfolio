import fs from "fs";
import path from "path";

const TOKEN_PATH = path.resolve(process.cwd(), "auth-token.json");

const USER_ROLES_MAP = {
    user: [{ ID: "user" }],
    user2: [{ ID: "user" }], // Додано роль для другого звичайного юзера
    admin: [
        { ID: "moderator_blog" },
        { ID: "moderator_bookie" },
        { ID: "moderator_broadcast" },
        { ID: "moderator_casino" },
        { ID: "moderator_chat" },
        { ID: "moderator_comment" },
        { ID: "moderator_footer_link" },
        { ID: "moderator_logo" },
        { ID: "moderator_news" },
        { ID: "moderator_plus" },
        { ID: "moderator_profile" },
        { ID: "moderator_roles" },
        { ID: "moderator_sport" },
        { ID: "moderator_tag" },
        { ID: "moderator_teaser" },
        { ID: "user" },
    ],
};

function getStoredTokens() {
    if (!fs.existsSync(TOKEN_PATH)) {
        throw new Error(`❌ No token file ${TOKEN_PATH}`);
    }
    return JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
}

/**
 * @param {import('@playwright/test').BrowserContext} context
 * @param {'user' | 'user2' | 'admin'} [userType='user']
 */
export async function authState(context, userType = "user") {
    const tokenData = getStoredTokens();
    const currentUser = tokenData[userType];

    if (!currentUser) {
        throw new Error(`❌ User type "${userType}" not found in auth-token.json`);
    }

    const token = currentUser.token || currentUser["X-Auth-Token"];
    const userId = currentUser.userId;

    const sportsappAuthObj = {
        time: Date.now(),
        data: {
            roles: USER_ROLES_MAP[userType] || USER_ROLES_MAP.user,
            hasUserLoggedIn: true,
            authToken: token,
            id: userId,
            avatar: null,
        },
    };

    await context.addInitScript(({ authData }) => {
        window.localStorage.setItem("sportsapp:login:user", JSON.stringify(authData));
    }, { authData: sportsappAuthObj });
}

/**
 * @param {import('@playwright/test').BrowserContext} context
 */
export async function authAdminState(context) {
    const tokenData = getStoredTokens();
    const adminUser = tokenData.admin;

    if (!adminUser) {
        throw new Error(`❌ Admin ("admin") not found in auth-token.json`);
    }

    const adminToken = adminUser.token;

    await context.addInitScript(({ token }) => {
        window.localStorage.setItem("auth:token", token);
    }, { token: adminToken });
}