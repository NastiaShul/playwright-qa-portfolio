---
id: null
title: "[WEB][SEO] Всі види спорту, Блог — пагінація — canonical на головну блогу, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/blogs/blogPagination.seo.spec.js"
---

# [WEB][SEO] Всі види спорту, Блог — пагінація — canonical на головну блогу, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`; INT — `en`, `de`, `fr`, `it`, `es`, `ar`.
2. Тестові дані (блоги з кількома сторінками постів із SEO-таблиці, існують на stage):
   - UA — `dynamonline`;
   - BY — `fullfootballmatches`;
   - INT — `_don039t-touch-my-paella`.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.
> INT `pt-br` і `pl` ще не опубліковані — не перевіряються.

## Steps
1. [ ] **Action:**
   Відкрити другу сторінку блогу за шаблоном `/{lang?}/blogs/{hru}/page2/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити тег `link[rel="canonical"]` у `<head>`.

   **Expected:**
   1. Тег canonical один.
   2. Canonical веде на головну сторінку блогу тієї ж мовної версії на прод-домені:
      - UA: `https://ua.example.com/{lang?}/blogs/dynamonline/`
      - BY: `https://by.example.com/{lang?}/blogs/fullfootballmatches/`
      - INT: `https://example.com/{lang}/blogs/_don039t-touch-my-paella/` (en, de, fr, it, es, ar)

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. Теги hreflang відсутні.

## Expected Results
Сторінки пагінації блогу відкриваються без редиректу на всіх мовних версіях UA, BY та INT (крім PT-BR і PL), вказують canonical на головну сторінку блогу відповідної мовної версії і не містять hreflang.
