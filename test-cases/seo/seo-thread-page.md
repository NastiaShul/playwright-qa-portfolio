---
id: null
title: "[WEB][SEO] Усі види спорту, Тред — noindex, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/threads/threadPage.seo.spec.js"
---

# [WEB][SEO] Усі види спорту, Тред — noindex, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`; INT — `en`, `de`, `fr`, `it`, `es`, `ar` (підпапки на основному домені). INT `pt-br` і `pl` — ще не опубліковано, не перевіряються.
2. Шаблон: `/{lang?}/threads/{id}/`.
3. Тестові дані — тред для кожної мовної версії:
   - UA: `3000000003230`;
   - BY: `3000000000129`;
   - INT: en — `3000000005478`, de — `3000000005469`, fr — `3000000005973`, it — `3000000005453`, es — `3000000005451`, ar — `3000000005483`.
4. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.
> Треди fr і ar із SEO-таблиці (`3000000005426`, `3000000005448`) на stage віддають 404, тому замінені на наявні.

## Steps
1. [ ] **Action:**
   Відкрити тред за шаблоном `/{lang?}/threads/{id}/` для кожної мовної версії проєкту.

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
Сторінка треду закрита від індексації (`noindex`) на всіх опублікованих мовних версіях UA, BY та INT. Теги hreflang і x-default відсутні.
