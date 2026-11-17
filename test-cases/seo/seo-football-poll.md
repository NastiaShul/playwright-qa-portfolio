---
id: null
title: "[WEB][SEO] Футбол, Опитування — noindex, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/polls/footballPoll.seo.spec.js"
---

# [WEB][SEO] Футбол, Опитування — noindex, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`; INT — `en`, `de`, `fr`, `it`, `es`, `ar` (підпапки на основному домені). INT `pt-br` і `pl` — ще не опубліковано, не перевіряються.
2. Шаблон: UA/BY — `/{lang?}/football/polls/{id}-{hru}/`, INT — `/{lang}/polls/{yyyy}-{mm}-{dd}-{hru}/`.
3. Тестові дані — опитування для кожної мовної версії:
   - UA: `2000000000439-khto-stane-peremozhtsem-chm2026`;
   - BY: `2000000000003-ni-reala-ni-man-siczi-za-kago-vy-czyaper-u-lize-chempiyo`;
   - INT:
     - en — `2026-09-06-whos-your-barcelona-motm-against-valencia`;
     - de — `2026-09-06-wer-verdient-aktuell-den-platz-als-deutschlands-nummer-eins`;
     - fr — `2026-09-05-au-vu-du-debut-de-saison-de-matvey-safonov-luis-enrique-devraitil-redonner-sa-chance-a-lu`;
     - it — `2026-09-04-internapoli-come-finira-il-big-match-di-serie-a-fai-il-tuo-pronostico-e-vota-il-sondaggio`;
     - es — `2026-09-06-quien-fue-el-mejor-jugador-en-la-victoria-de-barcelona-ante-el-valencia-por-laliga`;
     - ar — `2026-09-02-bd-nth-lmyrktw-rsmy-m-tqyymk-lsfqt-brshlwn`.
4. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.

## Steps
1. [ ] **Action:**
   Відкрити опитування за шаблоном для кожної мовної версії проєкту: UA/BY — `/{lang?}/football/polls/{id}-{hru}/`, INT — `/{lang}/polls/{yyyy}-{mm}-{dd}-{hru}/`.

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
Сторінка футбольного опитування закрита від індексації (`noindex`) на всіх опублікованих мовних версіях UA, BY та INT. Теги hreflang і x-default відсутні.
