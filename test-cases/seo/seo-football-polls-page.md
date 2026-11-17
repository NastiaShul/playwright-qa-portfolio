---
id: null
title: "[WEB][SEO] Футбол, Список опитувань — індексується, спільні hreflang для всіх мов, x-default — INT en"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/polls/footballPollsPage.seo.spec.js"
---

# [WEB][SEO] Футбол, Список опитувань — індексується, спільні hreflang для всіх мов, x-default — INT en

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`; INT — `en`, `de`, `fr`, `it`, `es`, `ar`, `pt-br`, `pl` (підпапки на основному домені, напр. `example.com/de/polls/`).
2. Тестові дані не потрібні.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.

## Steps
1. [ ] **Action:**
   Відкрити сторінку для кожної мовної версії проєкту: UA/BY — за шаблоном `/{lang?}/football/polls/`, INT — за шаблоном `/{lang}/polls/`.

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
   1. На всіх мовних версіях UA, BY та INT — однаковий набір hreflang (URL на прод-домені):
      - `uk` → `https://ua.example.com/uk/football/polls/`, `ru` → `https://ua.example.com/football/polls/`
      - `be` → `https://by.example.com/be/football/polls/`, `ru-RU`, `ru-BY`, `ru-KZ` → `https://by.example.com/football/polls/`
      - `en`, `de`, `fr`, `it`, `es`, `ar`, `pl` → `https://example.com/{lang}/polls/`, `pt-BR` → `https://example.com/pt-br/polls/`
   2. Дублів hreflang немає.
   3. `x-default` → `https://example.com/en/polls/`.

## Expected Results
Футбольний список опитувань індексується на всіх мовних версіях UA, BY та INT. Hreflang спільні для всіх проєктів і мов, x-default веде на INT `en`.
