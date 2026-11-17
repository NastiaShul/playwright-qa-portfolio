---
id: null
title: "[WEB] [UA/BY/INT] A/B test плейсхолдер в інпуті коментування"
section_id: null
priority_id: 2
type_id: null
refs: "JIRA-2194"
spec_file: "tests/uiRegression/comments/commentsPlaceholderAbTest.spec.js"
---

# [WEB] [UA/BY/INT] A/B test плейсхолдер в інпуті коментування

## Preconditions

- Environment: фіча-стенди `feature.dev.example.com`, `feature.dev.ua.example.com`, `feature.dev.by.example.com` (API `api-gateway.dev.*`); після мержу — staging
- GrowthBook A/B test (50/50 по трафіку):
  - Feature flag ID: `comments-input-placeholder`
  - Experiment key: `comments-input-placeholder-test`
  - Група A (`false`/не завантажилась) — старий плейсхолдер (`comments-placeholder.classic` = `write-comment`)
  - Група B (`true`) — новий заклик, обраний випадково при кожному завантаженні матеріалу
- Групу форсуємо query-параметром на URL матеріалу: `?comments-input-placeholder-test=0` — група A, `?comments-input-placeholder-test=1` — група B
  - В автотестах додатково підміняємо відповідь GrowthBook (`forceAbGroups`: `**/api/features/**` + `localStorage gb_comments-input-placeholder`)
  - В автотестах параметр працює лише з userAgent `UIAutotest` (з дефолтним headless UA GrowthBook не запитується)
- Форма коментарів рендериться через InView: перед перевіркою плейсхолдера доскролити до інпуту
- Матеріали: новина / пост / тред / стаття — з коментарями та без коментарів
- Проєкти й локалі: UA (`uk`, `ru`), BY (`be`, `ru`), INT (`en`, `es`, `ar`, `fr`, `de`, `it`)
  - Jira каже "Сайти юа та інт", але в коді `geo: null, locales: null`, переклади є й для BY — таргетинг вирішує GrowthBook

### Очікувані тексти

| Локаль | Група A (classic) | Є коменти (група B) | Нема коментів (група B) |
| --- | --- | --- | --- |
| uk | Написати коментар | ➕ Додайте свої п'ять копійок · 🍿 Диванні експерти, вам слово · 🔥 Підлий масла у вогонь · 🌪️ Наведи тут кіпіш | 🥇 Перше слово за тобою · 📣 Нароби галасу |
| ru | Написать комментарий | ➕ Вставь свои пять копеек · 🍿 Диванные аналитики, ваш выход · 🔥 Подкинь дров · 🌪️ Наведи шороху | 🥇 Первое слово за тобой · 📣 Наведи шума |
| be | Напiсаць каментарый | ➕ Устаў свае пяць капеек · 🍿 Канапавыя эксперты, вам слова · 🔥 Падкінь дроў · 🌪️ Падымі вэрхал | 🥇 Першае слова за табой · 📣 Разруш гэтую цішыню |
| en | Type your comment | ➕ Pitch in your two cents · 🍿 Keyboard warriors, your play · 🔥 Turn up the heat · 🌪️ Stir the pot | 🥇 You've got the floor · 📣 Make some noise |
| es | Escribe tu respuesta | ➕ Mete tu cuchara · 🍿 Alborota el gallinero · 🔥 Apaga el fuego con gasolina · 🌪️ Agita el avispero | 🥇 La primera palabra es tuya · 📣 Hey, rompe el hielo |
| ar | اكتب تعليقك | ➕ شاركنا رأيك · 🍿 يا أبطال الكيبورد، دوركم الآن · 🔥 أشعلوا النقاش · 🌪️ ولع النقاش | 🥇 الكلمة لكم · 📣 عبّروا عن رأيكم بصوت عالٍ |
| fr | Écrivez votre commentaire | ➕ Mets ton grain de sel · 🍿 Entraîneurs du dimanche, la parole est à vous · 🔥 Fais monter la température · 🌪️ Relance le débat | 🥇 La parole est à toi ! · 📣 Balance la sauce |
| de | Kommentar eingeben | ➕ Gib deinen Senf dazu · 🍿 Sofa-Experten, ihr seid dran! · 🔥 Gieß Öl ins Feuer · 🌪️ Misch dich ein | 🥇 Mach den Anfang · 📣 Brich das Eis |
| it | Scrivi il tuo commento | ➕ Fai sentire la tua voce · 🍿 Tuttologi, tocca a voi · 🔥 Metti altra carne al fuoco · 🌪️ Scatena l'inferno | 🥇 A te la prima parola · 📣 Rompi il ghiaccio |

---

## Steps

### Група A — Control

1. [ ] **Action:**
   Форсувати групу A. Відкрити новину **з коментарями**, відкрити блок/модалку коментарів.

   **Expected:**
   1. Плейсхолдер головного інпуту — старий текст (`classic`) для поточної локалі.

2. [ ] **Action:**
   Форсувати групу A. Відкрити новину **без коментарів**.

   **Expected:**
   1. Плейсхолдер — старий текст (`classic`).

### Група B — новий плейсхолдер

3. [ ] **Action:**
   Форсувати групу B. Відкрити новину **з коментарями**.

   **Expected:**
   1. Плейсхолдер — один з 4 варіантів колонки "Є коменти" для поточної локалі.
   2. Плейсхолдер не дорівнює старому тексту і не є ключем перекладу (`comments-placeholder.*`).

4. [ ] **Action:**
   Форсувати групу B. Відкрити новину **без коментарів**.

   **Expected:**
   1. Плейсхолдер — один з 2 варіантів колонки "Нема коментів".

5. [ ] **Action:**
   Форсувати групу B. Перезавантажити матеріал з коментарями ~10 разів.

   **Expected:**
   1. Кожного разу плейсхолдер з набору "Є коменти".
   2. Варіант змінюється між завантаженнями (є щонайменше 2 різні) — вибір рандомний, без прив'язки до матеріалу.

6. [ ] **Action:**
   Повторити кроки 3–4 для поста (блоги), треду, статті, опитування.

   **Expected:**
   1. Логіка така сама, як для новини.

### Форма відповіді / редагування (не входить в A/B тест)

7. [ ] **Action:**
   Адміном (звичайний юзер на коментарі з апки отримує модалку "Get the App") у групах A та B натиснути "Відповісти" на коментарі.

   **Expected:**
   1. Плейсхолдер інпуту відповіді — старий текст (`write-comment`) в обох групах.

### Перехід "нема → є коментарі" (manual)

8. [ ] **Action:**
   Група B, матеріал без коментарів. Опублікувати перший коментар.

   **Expected:**
   1. Після публікації плейсхолдер головного інпуту переключається на варіант з набору "Є коменти" (у коді `useMemo` залежить від `hasComments`).
   2. Не з'являється ключ перекладу / порожній плейсхолдер.

### Аналітика (manual)

9. [ ] **Action:**
    Клікнути в головний інпут коментаря у групах A та B.

    **Expected:**
    1. Подія `comments / click / to_write_comment` має value `${objectClass}_${objectId}_${totalCommentsCount}_${placeholderType}`.
    2. `placeholderType` = `classic` для групи A; `plus|expert|fire|tornado` або `word|noise` для групи B — відповідає показаному тексту.

### Регрес

10. [ ] **Action:**
    Група B, мобільна версія (Galaxy S24) + десктоп. Перевірити довгі плейсхолдери (FR "🍿 Entraîneurs du dimanche, la parole est à vous", AR).

    **Expected:**
    1. Текст не ламає верстку інпуту (обрізається/переноситься коректно), емодзі відображаються.
    2. AR — RTL коректний.

11. [ ] **Action:**
    Група B, перезавантажити сторінку з SSR (без кешу) і переглянути консоль.

    **Expected:**
    1. Немає hydration mismatch через різний плейсхолдер на сервері й клієнті (рандом у `useMemo`).

## Expected Results

У групі A плейсхолдер не змінюється. У групі B під матеріалом з коментарями показується випадковий з 4 закликів, без коментарів — випадковий з 2, локалізований для кожної мови; вибір перегенеровується на кожне завантаження матеріалу.
