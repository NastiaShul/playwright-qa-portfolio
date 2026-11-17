---
id: null
title: "[WEB][SEO] Головна сторінка — індексується, спільні hreflang для UA/BY та INT"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/news/mainPage.seo.spec.js"
---

# [WEB][SEO] Головна сторінка — індексується, спільні hreflang для UA/BY та INT

## Preconditions
1. Оточення: stage. Сторінки для перевірки:
   - UA: `/` (ru), `/uk/`
   - BY: `/` (ru), `/be/`
   - INT: `example.com/` (en), `de.`, `fr.`, `it.`, `es.`, `ar.`, `pt-br.`, `pl.example.com/` — мовні версії на піддоменах
   - INT (підпапки): `example.com/en/`, `/de/`, `/fr/`, `/it/`, `/es/`, `/ar/`, `/pt-br/`, `/pl/`
2. Тестові дані не потрібні.
3. Без авторизації.

> Сторінка «Футбол» UA/BY має той самий набір hreflang, що й головні INT, але перевіряється окремо — див. `seo-football-main.md`.

## Steps
1. [ ] **Action:**
   Відкрити кожну головну сторінку UA, BY та INT зі списку.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з відкритим.

2. [ ] **Action:**
   Перевірити директиви robots у `<head>` (`meta[name="robots"]`) та в HTTP-заголовку `X-Robots-Tag`.

   **Expected:**
   1. Відсутня директива `noindex`.

3. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>` головних UA і BY (`/`, `/uk/`, `/be/`).

   **Expected:**
   1. Присутні рівно ці hreflang (URL на прод-домені):
      - `uk` → `https://ua.example.com/uk/`, `ru` → `https://ua.example.com/`
      - `be` → `https://by.example.com/be/`, `ru-RU`, `ru-BY`, `ru-KZ` → `https://by.example.com/`
   2. Дублів hreflang немає.
   3. `x-default` відсутній.

4. [ ] **Action:**
   Перевірити теги `link[rel="alternate"][hreflang]` у `<head>` головних INT (усі піддомени).

   **Expected:**
   1. Присутні рівно ці hreflang (URL на прод-домені):
      - `x-default`, `en` → `https://example.com/`
      - `de`, `es`, `fr`, `it`, `ar`, `pl` → `https://{lang}.example.com/`
      - `pt-BR` → `https://pt-br.example.com/`
      - `uk` → `https://ua.example.com/uk/football/`, `ru` → `https://ua.example.com/football/`
      - `be` → `https://by.example.com/be/football/`, `ru-RU`, `ru-BY`, `ru-KZ` → `https://by.example.com/football/`
   2. Дублів hreflang немає.

5. [ ] **Action:**
   Відкрити кожну сторінку-підпапку INT (`example.com/{lang}/`).

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з відкритим.

6. [ ] **Action:**
   Перевірити тег `link[rel="canonical"]` у `<head>` сторінок-підпапок INT.

   **Expected:**
   1. Присутній рівно один canonical (URL на прод-домені), що веде на відповідний піддомен:
      - `/en/` → `https://example.com/`
      - `/de/`, `/fr/`, `/it/`, `/es/`, `/ar/`, `/pl/` → `https://{lang}.example.com/`
      - `/pt-br/` → `https://pt-br.example.com/`

## Expected Results
Головні сторінки UA, BY та INT індексуються. Головні UA і BY посилаються одна на одну без x-default; головні INT мають повний набір hreflang із посиланнями на «Футбол» UA/BY і x-default на `example.com`. Сторінки-підпапки INT (`example.com/{lang}/`) віддають 200 і мають canonical на відповідний мовний піддомен.
