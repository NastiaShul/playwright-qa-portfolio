---
id: null
title: "[WEB][SEO] Усі види спорту, Пагінація новин — canonical на стрічку новин, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/news/newsPagination.seo.spec.js"
---

# [WEB][SEO] Усі види спорту, Пагінація новин — canonical на стрічку новин, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`. INT не покривається (шаблону для INT немає).
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` відсутній.

## Steps
1. [ ] **Action:**
   Відкрити другу сторінку стрічки новин за шаблоном `/{lang?}/news/page2/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити тег `link[rel="canonical"]` у `<head>`.

   **Expected:**
   1. Тег canonical один.
   2. Canonical веде на першу сторінку стрічки новин тієї ж мовної версії на прод-домені: `{prod}/{lang?}/news/` (UA — `https://ua.example.com/`, BY — `https://by.example.com/`).

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. Теги hreflang відсутні.

## Expected Results
Сторінки пагінації стрічки новин відкриваються без редиректу, вказують canonical на першу сторінку стрічки новин і не містять hreflang.
