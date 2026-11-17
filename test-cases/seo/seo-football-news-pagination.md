---
id: null
title: "[WEB][SEO] Футбол, Стрічка новин — пагінація — canonical на стрічку новин, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/news/footballNewsPagination.seo.spec.js"
---

# [WEB][SEO] Футбол, Стрічка новин — пагінація — canonical на стрічку новин, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`; INT — `en`, `de`, `fr`, `it`, `es`, `ar`.
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA та BY відсутній. На INT футбол — основний вид спорту, тому стрічка футбольних новин має шаблон `/{lang}/news/`.
>
> INT `pt-br`, `pl` не покриті: за SEO-таблицею сторінки ще не опубліковані.

## Steps
1. [ ] **Action:**
   Відкрити другу сторінку стрічки футбольних новин: UA/BY — `/{lang?}/football/news/page2/`, INT — `/{lang}/news/page2/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити тег `link[rel="canonical"]` у `<head>`.

   **Expected:**
   1. Тег canonical один.
   2. Canonical веде на першу сторінку стрічки футбольних новин тієї ж мовної версії на прод-домені:
      - UA ru: `https://ua.example.com/football/news/`
      - UA uk: `https://ua.example.com/uk/football/news/`
      - BY ru: `https://by.example.com/football/news/`
      - BY be: `https://by.example.com/be/football/news/`
      - INT (`{lang}`): `https://example.com/{lang}/news/` (en, de, fr, it, es, ar)

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. Теги hreflang відсутні.

## Expected Results
Сторінки пагінації стрічки футбольних новин відкриваються без редиректу на мовних версіях UA, BY та INT (крім `pt-br`, `pl`), вказують canonical на першу сторінку стрічки новин відповідної мовної версії і не містять hreflang.
