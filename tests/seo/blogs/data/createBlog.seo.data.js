// Профиль пользователя / Создать блог — noindex, hreflang нет.
// Без логина страница отдаёт 403.

// Роль из auth-token.json
export const createBlogUser = "user";

export const createBlogSeoData = {
  UA: {
    locales: [
      { lang: "uk", path: "uk/blogs/_add/" }
    ]
  },
  BY: {
    locales: [
      { lang: "be", path: "be/blogs/_add/" }
    ]
  },
  INT: {
    locales: [
      { lang: "en", path: "en/blogs/_add/" }
    ]
  }
};
