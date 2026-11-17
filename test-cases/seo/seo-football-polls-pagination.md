---
id: null
title: "[WEB][SEO] Футбол, Пагінація опитувань — canonical на список опитувань, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/polls/footballPollsPagination.seo.spec.js"
---

# [WEB][SEO] Футбол, Пагінація опитувань — canonical на список опитувань, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; INT — `en`, `de`, `fr`, `it`, `es`, `ar` (підпапки на основному домені, напр. `example.com/de/polls/page2/`). INT `pt-br` і `pl` не покриваються — у SEO-таблиці «пока не опубліковано». BY поки не покривається — друга сторінка на stage віддає 404 (недостатньо опитувань).
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA відсутній.

## Steps
1. [ ] **Action:**
   Відкрити другу сторінку списку опитувань: UA — `/{lang?}/football/polls/page2/`, INT — `/{lang}/polls/page2/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити тег `link[rel="canonical"]` у `<head>`.

   **Expected:**
   1. Тег canonical один.
   2. Canonical веде на першу сторінку списку опитувань тієї ж мовної версії на прод-домені: UA — `https://ua.example.com/{lang?}/football/polls/`, INT — `https://example.com/{lang}/polls/`.

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. Теги hreflang відсутні.

## Expected Results
Сторінки пагінації футбольного списку опитувань відкриваються без редиректу на всіх покритих мовних версіях UA та INT, вказують canonical на першу сторінку списку опитувань і не містять hreflang.
