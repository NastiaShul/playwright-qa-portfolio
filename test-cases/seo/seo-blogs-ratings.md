---
id: null
title: "[WEB][SEO] Блог, Рейтинги блогів (всі блоги) — індексується, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/blogs/blogsRatings.seo.spec.js"
---

# [WEB][SEO] Блог, Рейтинги блогів (всі блоги) — індексується, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`.
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.
> INT не покривається SEO-таблицею — не перевіряється.

## Steps
1. [ ] **Action:**
   Відкрити сторінку за шаблоном `/{lang?}/blogs/ratings/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити директиви robots у `<head>` (`meta[name="robots"]`) та в HTTP-заголовку `X-Robots-Tag`.

   **Expected:**
   1. Директива `noindex` відсутня.

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. Теги hreflang відсутні (у тому числі `x-default`).

## Expected Results
Сторінка рейтингів блогів відкривається без редиректу на всіх мовних версіях UA і BY, індексується та не містить hreflang.
