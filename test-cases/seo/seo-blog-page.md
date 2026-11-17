---
id: null
title: "[WEB][SEO] Всі види спорту, Блог — індексується, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/blogs/blogPage.seo.spec.js"
---

# [WEB][SEO] Всі види спорту, Блог — індексується, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`; INT — `en`, `de`, `fr`, `it`, `es`, `ar`.
2. Шаблон: `/{lang?}/blogs/{hru}/`.
3. Тестові дані (блоги із SEO-таблиці, існують на stage):
   - UA — `dynamonline`;
   - BY — `fullfootballmatches`;
   - INT — `_don039t-touch-my-paella`.
4. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.
> INT `pt-br` і `pl` ще не опубліковані — не перевіряються.

## Steps
1. [ ] **Action:**
   Відкрити сторінку блогу за шаблоном для кожної мовної версії проєкту.

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
Сторінка блогу відкривається без редиректу на всіх мовних версіях UA, BY та INT (крім PT-BR і PL), індексується та не містить hreflang.
