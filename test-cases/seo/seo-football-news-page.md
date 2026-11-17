---
id: null
title: "[WEB][SEO] Футбол, Стрічка новин — індексується, спільні hreflang для всіх мов, x-default — INT en"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/news/footballNewsPage.seo.spec.js"
---

# [WEB][SEO] Футбол, Стрічка новин — індексується, спільні hreflang для всіх мов, x-default — INT en

## Preconditions
1. Оточення: stage. Мовні версії: UA (ru, uk), BY (ru, be), INT (en, de, fr, it, es, ar, pt-br, pl).
2. Тестові дані: публічна сторінка, що не потребує авторизації.
3. Користувач не авторизований (гість / пошуковий бот).

> `{lang?}` — мовний префікс, для `ru` на UA та BY відсутній. На INT футбол — основний вид спорту, тому стрічка футбольних новин має шаблон `/{lang}/news/`.

## Steps
1. [ ] **Action:**
   Відкрити сторінку за шаблоном `/{lang?}/football/news/` (UA/BY) або `/{lang}/news/` (INT) для кожної мовної версії проєкту.

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
   1. Присутні рівно такі hreflang (URL на прод-домені):
      - `x-default`: `https://example.com/en/news/`
      - `en`: `https://example.com/en/news/`
      - `de`: `https://example.com/de/news/`
      - `fr`: `https://example.com/fr/news/`
      - `it`: `https://example.com/it/news/`
      - `es`: `https://example.com/es/news/`
      - `ar`: `https://example.com/ar/news/`
      - `pt-BR`: `https://example.com/pt-br/news/`
      - `pl`: `https://example.com/pl/news/`
      - `uk`: `https://ua.example.com/uk/football/news/`
      - `ru`: `https://ua.example.com/football/news/`
      - `be`: `https://by.example.com/be/football/news/`
      - `ru-BY`: `https://by.example.com/football/news/`
      - `ru-RU`: `https://by.example.com/football/news/`
      - `ru-KZ`: `https://by.example.com/football/news/`
   2. Дублів hreflang немає.

## Expected Results
Стрічка футбольних новин відкривається для всіх мовних версій UA, BY та INT, індексується пошуковими системами та містить спільний повний набір із 15 тегів hreflang із x-default на англійську версію INT.
