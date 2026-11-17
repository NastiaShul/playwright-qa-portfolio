---
id: null
title: "[WEB][SEO] Інші види спорту, Опитування — noindex, без hreflang"
section_id: null
priority_id: 2
type_id: null
refs: null
spec_file: "tests/seo/polls/sportPoll.seo.spec.js"
---

# [WEB][SEO] Інші види спорту, Опитування — noindex, без hreflang

## Preconditions
1. Оточення: stage. Мовні версії: UA — `ru` (без префікса), `uk`; BY — `ru` (без префікса), `be`. Сторінка є лише на UA та BY, на INT не перевіряється.
2. Шаблон: `/{lang?}/{sport}/polls/{id}-{hru}/`, де `{sport}` — будь-який вид спорту, крім футболу (див. "Список всіх видів спорту").
3. Тестові дані — опитування для кожної мовної версії:
   - UA: `basketball/polls/2000000000466-chy-vyyde-ukrayina-chs-z-baketbolu`;
   - BY: `hockey/polls/2000000000002-czi-zauzeecze-vy-za-minskae-dynama-u-plejof-kxl`.
4. Без авторизації.

> `{lang?}` — мовний префікс, для `ru` на UA/BY відсутній.

## Steps
1. [ ] **Action:**
   Відкрити опитування за шаблоном `/{lang?}/{sport}/polls/{id}-{hru}/` для кожної мовної версії проєкту.

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
Сторінка опитування з інших видів спорту закрита від індексації (`noindex`) на всіх мовних версіях UA та BY. Теги hreflang і x-default відсутні.
