---
id: null
title: "[WEB][SEO] Усі види спорту, Пагінація опитувань — canonical на список опитувань, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/polls/pollsPagination.seo.spec.js"
---

# [WEB][SEO] Усі види спорту, Пагінація опитувань — canonical на список опитувань, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`. BY поки не покривається (прикладів у SEO-таблиці немає — «пока нет»), INT не покривається (шаблону для INT немає).
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` відсутній.

## Steps
1. [ ] **Action:**
   Відкрити другу сторінку списку опитувань за шаблоном `/{lang?}/polls/page2/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити тег `link[rel="canonical"]` у `<head>`.

   **Expected:**
   1. Тег canonical один.
   2. Canonical веде на першу сторінку списку опитувань тієї ж мовної версії на прод-домені: `https://ua.example.com/{lang?}/polls/`.

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. Теги hreflang відсутні.

## Expected Results
Сторінки пагінації списку опитувань відкриваються без редиректу, вказують canonical на першу сторінку списку опитувань і не містять hreflang.
