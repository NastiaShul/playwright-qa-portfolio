// Групи A/B тестів (GrowthBook) форсуємо детерміновано:
// - підміняємо відповідь GrowthBook (api-gb.trbna.com/api/features/...): з UA UIAutotest запит то проходить, то ні,
//   і тоді група або 0 (фіча не завантажилась), або випадкова 50/50. Параметр ?<experimentKey>=1 через це теж не працює;
// - кладемо групу в localStorage gb_<featureId>: для фіч з needsCls інлайн-скрипт ставить її в html[data-gb-<featureId>] ще до рендеру
export async function forceAbGroups(page, groups) {
    const features = Object.fromEntries(
        Object.entries(groups).map(([featureId, value]) => [featureId, { defaultValue: value }])
    );
    await page.route("**/api/features/**", (route) =>
        route.fulfill({ contentType: "application/json", body: JSON.stringify({ features }) })
    );
    await page.addInitScript((values) => {
        Object.entries(values).forEach(([featureId, value]) => localStorage.setItem(`gb_${featureId}`, String(value)));
    }, groups);
}
