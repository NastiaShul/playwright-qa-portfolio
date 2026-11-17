---
id: null
title: "[WEB][SEO] Усі види спорту, Стрічка новин — індексується, спільні hreflang лише для UA/BY, без x-default"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/news/newsPage.seo.spec.js"
---

# [WEB][SEO] Усі види спорту, Стрічка новин — індексується, спільні hreflang лише для UA/BY, без x-default

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`. INT не покривається (шаблону для INT немає).
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` відсутній.

## Steps
1. [ ] **Action:**
   Відкрити сторінку за шаблоном `/{lang?}/news/` для кожної мовної версії проєкту.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити директиви robots у `<head>` (`meta[name="robots"]`) та в HTTP-заголовку `X-Robots-Tag`.

   **Expected:**
   1. Відсутня директива `noindex`.

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>`.

   **Expected:**
   1. На всіх мовних версіях UA та BY — однаковий набір hreflang (URL на прод-домені):
      - `uk` → `https://ua.example.com/uk/news/`, `ru` → `https://ua.example.com/news/`
      - `be` → `https://by.example.com/be/news/`, `ru-RU`, `ru-BY`, `ru-KZ` → `https://by.example.com/news/`
   2. Дублів hreflang немає.
   3. `x-default` відсутній.

## Expected Results
Стрічка новин індексується на всіх мовних версіях UA та BY. Hreflang спільні для проєктів: сторінки UA і BY посилаються одна на одну, x-default відсутній.
