---
id: null
title: "[WEB][SEO] Футбол, Новина — індексується, hreflang окремо для UA / BY / INT, x-default — en, якщо є англ. версія"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/news/footballNewsArticle.seo.spec.js"
---

# [WEB][SEO] Футбол, Новина — індексується, hreflang окремо для UA / BY / INT, x-default — en, якщо є англ. версія

## Preconditions
1. Оточення: stage. Мовні версії: UA (ru, uk), BY (ru, be), INT (en, de, fr, it, es, ar).
2. Тестові дані — новини, що індексуються:
   - UA, новина двома мовами (ru, uk): `/football/1000000374251-trubinym-dovoli-predmetno-tsikavyvsya-lids-mykhaylo-spiv/` (з SEO-таблиці);
   - BY, новина двома мовами (ru, be): `/football/1113088176-valeryj-bacharou-lyavonau-chasta-zaxodzicz-u-razdzyavalnyu/` (з SEO-таблиці);
   - наскрізна новина UA|BY (ru, uk, be): UA — `/football/1000000387681-barselonu-oshtrafuvaly-na-602-yevro-za-pozovom-atletiko/`, BY — `/football/1113094310-barselonu-ashtrafavali-na-602-eura-pa-pazove-atletyka-zza-s/` (у кожного проєкту свій id та hru);
   - INT, новина з англ. версією (en, de, fr, it, es, ar): `/{lang}/news/2026-09-06-dimarco-…/` (з SEO-таблиці);
   - INT, новина без англ. версії (es, ar): `/es/news/2026-10-29-el-barcelona-femenino-aplasta-por-08-al-hb-koge-…/`, `/ar/news/2026-10-30-brshlwn-llsydt-yshq-tsh-by-kwjy-08-…/`.
3. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA та BY відсутній.
>
> Поки не покриті (немає тестових даних на stage): стани noindex (немає тіла, немає заголовка, публікація до 2010, external link, 30 слів і менше). INT `pt-br`, `pl` ще не опубліковані.

## Steps
1. [ ] **Action:**
   Відкрити новину за шаблоном `/{lang?}/football/%ID%-%hru%/` (UA/BY) або `/{lang}/news/%yyyy%-%mm%-%dd%-%hru%/` (INT) для кожної мовної версії кожного стану.

   **Expected:**
   1. Сторінка віддає статус `200`.
   2. Редиректу немає — URL збігається з шаблоном.

2. [ ] **Action:**
   Перевірити директиви robots у `<head>` (`meta[name="robots"]`) та в HTTP-заголовку `X-Robots-Tag`.

   **Expected:**
   1. Директива `noindex` відсутня.

3. [ ] **Action:**
   UA, новина двома мовами: перевірити теги `link[rel="alternate"][hreflang]` у `<head>` на `ru` та `uk` версіях.

   **Expected:**
   1. Присутні рівно `ru` → `https://ua.example.com/football/<hru>/` та `uk` → `https://ua.example.com/uk/football/<hru>/`.
   2. `x-default` відсутній.

4. [ ] **Action:**
   BY, новина двома мовами: перевірити теги `link[rel="alternate"][hreflang]` у `<head>` на `ru` та `be` версіях.

   **Expected:**
   1. Присутні рівно `be` → `https://by.example.com/be/football/<hru>/` та `ru-RU`, `ru-BY`, `ru-KZ` → `https://by.example.com/football/<hru>/`.
   2. `x-default` відсутній.

5. [ ] **Action:**
   Наскрізна новина UA|BY: перевірити теги `link[rel="alternate"][hreflang]` у `<head>` на UA `ru`, `uk` та BY `ru`, `be` версіях.

   **Expected:**
   1. Присутні рівно:
      - `ru` → `https://ua.example.com/football/<UA hru>/`;
      - `uk` → `https://ua.example.com/uk/football/<UA hru>/`;
      - `be` → `https://by.example.com/be/football/<BY hru>/`;
      - `ru-RU`, `ru-BY`, `ru-KZ` → `https://by.example.com/football/<BY hru>/`.
   2. `x-default` відсутній.

6. [ ] **Action:**
   INT, новина з англ. версією: перевірити теги `link[rel="alternate"][hreflang]` у `<head>` на кожній мовній версії.

   **Expected:**
   1. Присутні рівно `en`, `de`, `fr`, `it`, `es`, `ar` → URL відповідної мовної версії новини на `https://example.com/`.
   2. `x-default` → URL англ. версії новини.

7. [ ] **Action:**
   INT, новина без англ. версії: перевірити теги `link[rel="alternate"][hreflang]` у `<head>` на `es` та `ar` версіях.

   **Expected:**
   1. Присутні рівно `es`, `ar` → URL відповідної мовної версії новини на `https://example.com/`.
   2. `x-default` відсутній.
## Expected Results
Новини, що індексуються, відкриваються без редиректу, не мають noindex і містять hreflang лише в межах свого проєкту: UA — ru, uk; BY — be, ru-RU, ru-BY, ru-KZ; INT — мови, якими опублікована новина. Наскрізна новина UA|BY містить спільний набір ru, uk, be, ru-RU, ru-BY, ru-KZ. x-default є лише на INT і лише коли є англ. версія новини.