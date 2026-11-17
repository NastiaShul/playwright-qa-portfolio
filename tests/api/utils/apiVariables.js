// All credentials and keys come from environment variables (see .env.example).
// Never commit real values.
const env = (name) => process.env[name] ?? "";

const FIREBASE_SIGNIN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

export const REST_API_URL = `${FIREBASE_SIGNIN_URL}?key=${env("FIREBASE_API_KEY")}`;
// Betting projects (BT/BI) use a separate Firebase project
export const BT_REST_API_URL = `${FIREBASE_SIGNIN_URL}?key=${env("BT_FIREBASE_API_KEY")}`;

export const userInfo = {
  email: env("USER_EMAIL"),
  password: env("USER_PASSWORD"),
};

export const secondUserInfo = {
  email: env("USER2_EMAIL"),
  password: env("USER2_PASSWORD"),
};

export const adminUserInfo = {
  email: env("ADMIN_EMAIL"),
  password: env("ADMIN_PASSWORD"),
};

export const userForDeleteInfo = {
  email: env("DELETE_USER1_EMAIL"),
  password: env("DELETE_USER_PASSWORD"),
};

export const user2ForDeleteInfo = {
  email: env("DELETE_USER2_EMAIL"),
  password: env("DELETE_USER_PASSWORD"),
};

export const user3ForDeleteInfo = {
  email: env("DELETE_USER3_EMAIL"),
  password: env("DELETE_USER_PASSWORD"),
};

export const emptyUserInfo = {
  email: env("EMPTY_USER_EMAIL"),
  password: env("EMPTY_USER_PASSWORD"),
};
