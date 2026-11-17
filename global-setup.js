import fs from "fs";
import { request } from "@playwright/test";
import { authenticate } from "./tests/api/utils/functions/apiAuthFunction.js";
import { userInfo, secondUserInfo, adminUserInfo, emptyUserInfo, BT_REST_API_URL } from "./tests/api/utils/apiVariables.js";
import { checkBettingProject } from "./src/locales/seoLocalesBt.js";

const TOKEN_PATH = "./auth-token.json";

export default async function globalSetup() {
  if (process.env.SKIP_GLOBAL_SETUP === "true") {
    console.log("Skipping global setup...");
    return;
  }

  const context = await request.newContext();

  // Betting (BT/BI): own Firebase project and GraphQL; one user (SportsApp "user" credentials) is registered there for now
  if (checkBettingProject(process.env.BASE_URL)) {
    const apiUrl = process.env.BASE_URL.replace("://", "://api-gateway.").replace(/\/?$/, "/graphql/");
    const userAuth = await authenticate(context, userInfo.email, userInfo.password, { restUrl: BT_REST_API_URL, apiUrl });
    // Added as "btUser" next to the SportsApp roles, so a cached SportsApp token file keeps working
    const tokenData = fs.existsSync(TOKEN_PATH) ? JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8")) : {};
    tokenData.btUser = { token: userAuth["X-Auth-Token"], userId: userAuth.userId };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
    await context.dispose();
    return;
  }

  const userAuth = await authenticate(context, userInfo.email, userInfo.password);
  const userAuth2 = await authenticate(context, secondUserInfo.email, secondUserInfo.password);
  const emptyUser = await authenticate(context, emptyUserInfo.email, emptyUserInfo.password);
  const adminAuth = await authenticate(context, adminUserInfo.email, adminUserInfo.password);

  const tokenData = {
    user: {
      token: userAuth["X-Auth-Token"],
      userId: userAuth.userId,
    },
    user2: {
      token: userAuth2["X-Auth-Token"],
      userId: userAuth2.userId,
    },
    admin: {
      token: adminAuth["X-Auth-Token"],
      userId: adminAuth.userId,
    },
    emptyUser: {
      token: emptyUser["X-Auth-Token"],
      userId: emptyUser.userId,
    }
  };

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokenData, null, 2));
  await context.dispose();
}