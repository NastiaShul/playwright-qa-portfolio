---
id: null
title: "[WEB][SEO] Усі види спорту, Пагінація тредів — noindex, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/threads/threadsPagination.seo.spec.js"
---

# [WEB][SEO] Усі види спорту, Пагінація тредів — noindex, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`; INT — `en`, `de`, `fr`, `it`, `es`, `ar` (підпапки на основному домені, напр. `example.com/de/threads/page2/`). INT `pt-br` і `pl` не покриваються — у SEO-таблиці «пока не опубліковано».
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.

## Steps
1. [ ] **Action:**
   Відкрити другу сторінку списку тредів за шаблоном `/{lang?}/threads/page2/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити директиви robots у `<head>` (`meta[name="robots"]`) та в HTTP-заголовку `X-Robots-Tag`.

   **Expected:**
   1. Присутня директива `noindex`.

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. Теги hreflang відсутні.
   2. `x-default` відсутній.

## Expected Results
Сторінки пагінації списку тредів закриті від індексації (`noindex`) на всіх покритих мовних версіях UA, BY та INT. Теги hreflang і x-default відсутні.
