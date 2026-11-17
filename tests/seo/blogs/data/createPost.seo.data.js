// Профиль пользователя / Написать пост — noindex, hreflang нет.
// Шаблон /blogs/create-post/%id%/ — id блога подставляется автоматически
// после перехода на /blogs/create-post/

// Роль из auth-token.json
export const createPostUser = "admin";

export const createPostSeoData = {
  UA: {
    locales: [
      { lang: "uk", path: "uk/blogs/create-post/" }
    ]
  },
  BY: {
    locales: [
      { lang: "be", path: "be/blogs/create-post/" }
    ]
  },
  INT: {
    locales: [
      { lang: "en", path: "en/blogs/create-post/" },
      { lang: "fr", path: "fr/blogs/create-post/" }
    ]
  }
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// %base%%path%%id%/
export const buildCreatePostUrlPattern = (baseUrl, path) =>
  new RegExp(`^${escapeRegExp(`${baseUrl}${path}`)}[^/]+/$`);