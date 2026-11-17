import { expect, test } from "@playwright/test";
import { MainPage } from "../../../pages/main.page";
import { CommentsComponent } from "../../../pages/components/commentsComponent";
import { forceAbGroups } from "../../../src/utils/abTestHelper";
import { checkProject } from "../../api/utils/functions/checkProject";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

// Групу форсуємо і підміною відповіді GrowthBook (forceAbGroups), і query-параметром експерименту:
// group 0 — старий плейсхолдер (?comments-input-placeholder-test=0), group 1 — нові заклики (=1)
const FEATURE_ID = "comments-input-placeholder";
const EXPERIMENT_KEY = "comments-input-placeholder-test";

// Префікс шляху локалі: на UA/BY корінь сайту — ru
const LOCALES_BY_PROJECT = {
    UA: { uk: "uk/", ru: "" },
    BY: { be: "be/", ru: "" },
    INT: { en: "en/", es: "es/", ar: "ar/", fr: "fr/", de: "de/", it: "it/" },
};

// comments-placeholder.* з перекладів монорепи (JIRA-2194)
const PLACEHOLDERS = {
    uk: {
        classic: "Написати коментар",
        withComments: ["➕ Вставте п'ять копійок", "🍿 Диванні експерти, вам слово", "🔥 Підлий масла у вогонь", "🌪️ Наведи тут кіпіш"],
        noComments: ["🥇 Перше слово за тобою", "📣 Нароби галасу"],
    },
    ru: {
        classic: "Написать комментарий",
        withComments: ["➕ Вставьте пять копеек", "🍿 Диванные аналитики, ваш выход", "🔥 Подкинь дров", "🌪️ Наведи шороху"],
        noComments: ["🥇 Первое слово за тобой", "📣 Наведи шума"],
    },
    be: {
        classic: "Напiсаць каментарый",
        withComments: ["➕ Устаў свае пяць капеек", "🍿 Канапавыя эксперты, вам слова", "🔥 Падкінь дроў", "🌪️ Падымі вэрхал"],
        noComments: ["🥇 Першае слова за табой", "📣 Разруш гэтую цішыню"],
    },
    en: {
        classic: "Type your comment",
        withComments: ["➕ Add your two cents", "🍿 Keyboard warriors, your play", "🔥 Turn up the heat", "🌪️ Stir the pot"],
        noComments: ["🥇 You've got the floor", "📣 Make some noise"],
    },
    es: {
        classic: "Escribe tu respuesta",
        withComments: ["➕ Mete tu cuchara", "🍿 Alborota el gallinero", "🔥 Echa leña al fuego", "🌪️ Agita el avispero"],
        noComments: ["🥇 Tú tienes la palabra", "📣 Hey, rompe el hielo"],
    },
    ar: {
        classic: "اكتب تعليقك",
        withComments: ["➕ شاركنا رأيك", "🍿 يا أبطال الكيبورد، دوركم الآن", "🔥 أشعلوا النقاش", "🌪️ ولع النقاش"],
        noComments: ["🥇 الكلمة لكم", "📣 عبّروا عن رأيكم بصوت عالٍ"],
    },
    fr: {
        classic: "Écrivez votre commentaire",
        withComments: ["➕ Mets ton grain de sel", "🍿 Entraîneurs du dimanche, la parole est à vous", "🔥 Chauffe l'ambiance", "🌪️ Relance le débat"],
        noComments: ["🥇 La parole est à toi !", "📣 Balance la sauce"],
    },
    de: {
        classic: "Kommentar eingeben",
        withComments: ["➕ Gib deinen Senf dazu", "🍿 Sofa-Experten, ihr seid dran!", "🔥 Gieß Öl ins Feuer", "🌪️ Misch dich ein"],
        noComments: ["🥇 Mach den Anfang", "📣 Brich das Eis"],
    },
    it: {
        classic: "Scrivi il tuo commento",
        withComments: ["➕ Fai sentire la tua voce", "🍿 Tuttologi, tocca a voi", "🔥 Metti altra carne al fuoco", "🌪️ Scatena l'inferno"],
        noComments: ["🥇 A te la prima parola", "📣 Rompi il ghiaccio"],
    },
    // pl: {
    //     classic: "Napisz komentarz",
    //     withComments: ["➕ Dodaj swoje trzy grosze", "🍿 Eksperci kanapowi, wasza kolej", "🔥 Podkręć atmosferę", "🌪️ Wznieć burzę"],
    //     noComments: ["🥇 Pierwsze słowo należy do ciebie", "📣 Zrób trochę hałasu"],
    // },
    // pt: {
    //     classic: "Escreva seu comentário",
    //     withComments: ["➕ Dê sua opinião", "🍿 Especialistas de sofá, é a vez de vocês", "🔥 Aqueça a discussão", "🌪️ Agite o debate"],
    //     noComments: ["🥇 A primeira palavra é sua", "📣 Faça barulho"],
    // }
};

test.use({ userAgent: "UIAutotest" });

// Новину з коментарями / без беремо зі стрічки головної локалі, щоб не залежати від захардкоджених матеріалів
async function openNewsComments(page, prefix, hasComments, group) {
    const commentsComponent = new CommentsComponent(page);
    await forceAbGroups(page, { [FEATURE_ID]: group === 1 });
    await page.goto(`${BASE_URL}${prefix}`, { waitUntil: "domcontentloaded" });
    await new MainPage(page).acceptConsent();

    const href = await commentsComponent.findNewsLinkByComments(hasComments);
    test.skip(!href, `No news ${hasComments ? "with" : "without"} comments in the main feed`);

    const materialUrl = new URL(href, BASE_URL);
    materialUrl.searchParams.set(EXPERIMENT_KEY, group);
    await page.goto(materialUrl.href, { waitUntil: "domcontentloaded" });
    await commentsComponent.openCommentsModal();
    return commentsComponent;
}

// Форма коментарів обгорнута в InView: до появи у viewport SSR-інпут лишається з classic-плейсхолдером,
// тому скролимо до інпуту і чекаємо на значення з очікуваного набору
async function expectPlaceholderIn(input, expected) {
    let placeholder;
    await expect(async () => {
        await input.scrollIntoViewIfNeeded();
        placeholder = await input.getAttribute("placeholder");
        expect(expected).toContain(placeholder);
    }).toPass({ timeout: 10000 });
    // фактичний текст видно в Actions і в HTML-репорті
    await test.step(`Placeholder: "${placeholder}"`, async () => { });
    return placeholder;
}

test.describe("JIRA-2194: Comments input placeholder A/B test", () => {
    for (const [locale, prefix] of Object.entries(LOCALES_BY_PROJECT[project])) {
        const texts = PLACEHOLDERS[locale];

        test.describe(`${project} [${locale}]`, () => {
            test("Group A: classic placeholder for news with comments", async ({ page }) => {
                const commentsComponent = await openNewsComments(page, prefix, true, 0);

                await expectPlaceholderIn(commentsComponent.inputField, [texts.classic]);
            });

            test("Group A: classic placeholder for news without comments", async ({ page }) => {
                const commentsComponent = await openNewsComments(page, prefix, false, 0);

                await expectPlaceholderIn(commentsComponent.inputField, [texts.classic]);
            });

            test("Group B: one of 4 calls to action for news with comments", async ({ page }) => {
                const commentsComponent = await openNewsComments(page, prefix, true, 1);

                await expectPlaceholderIn(commentsComponent.inputField, texts.withComments);
            });

            test("Group B: one of 2 calls to action for news without comments", async ({ page }) => {
                const commentsComponent = await openNewsComments(page, prefix, false, 1);

                await expectPlaceholderIn(commentsComponent.inputField, texts.noComments);
            });
        });
    }

    // test(`${project}: Group B: placeholder is picked randomly on every page load`, async ({ page }) => {
    //     const [locale, prefix] = Object.entries(LOCALES_BY_PROJECT[project])[0];
    //     const commentsComponent = await openNewsComments(page, prefix, true, 1);

    //     // нескінченний скрол міняє URL на наступну статтю, тому замість reload відкриваємо той самий матеріал
    //     const materialUrl = page.url();

    //     // 10 завантажень: ймовірність отримати 4 рази з 4 той самий варіант ≈ 4 * (1/4)^10
    //     const shown = [];
    //     for (let i = 0; i < 10; i++) {
    //         if (i > 0) {
    //             await page.goto(materialUrl, { waitUntil: "domcontentloaded" });
    //             await commentsComponent.openCommentsModal();
    //         }
    //         shown.push(await expectPlaceholderIn(commentsComponent.inputField, PLACEHOLDERS[locale].withComments));
    //     }
    //     expect(new Set(shown).size, `${materialUrl}\nShown placeholders: ${shown.join(" | ")}`).toBeGreaterThan(1);
    // });
});
