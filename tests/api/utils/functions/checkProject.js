import * as constants from "../../../../src/constants"

export async function checkProject(url) {
    if (url.includes("by")) return "BY";
    if (url.includes("ua")) return "UA";
    return "INT";
}

export async function languageForProject(project) {
    if (project == "UA") return constants.uaApiLanguages;
    if (project == "BY") return constants.byApiLanguages;
    return constants.intLanguages;   
}

export async function newsHruByProject(project) {
    if (project == "UA") return "1000000233234-rebrov-pro-lihu-natsiy-dlya-mene-tse-diysno-bilshe-tovar";
    if (project == "BY") return "1113032060-yoxanes-bo-geta-nasha-aposhnyaya-finishnaya-liniya-yakuyu-m";
    return "2025-03-23-france-defeat-croatia-on-penalties-to-advance-to-nations-league-semifinals"; 
}

export async function postHruByProject(project) {
    if (project == "UA") return "3134864-karyera-zinchenka-vzhe-vlitku-zaznaye-rishuchykh-zmin-zyavylas";
    if (project == "BY") return "3279383-u-belfutbole-pakarali-66gadovaga-reczydyvista-za-falsifikaczyi";
    return "football-superstars-with-most-career-straight-red-cards-reve"; 
}

export async function authorByProject(project) {
    if (project == "UA") return "ff857124-6b83-40e7-a9e7-8a412aaa8aa7";
    if (project == "BY") return "1093148902";
    return "132ecf99-d14d-49d4-89c3-eb326b49bf9b"; 
}

export async function postIdByProject(project) {
    if (project == "UA") return "3135509";
    if (project == "BY") return "3279573";
    return "46196";
}

export async function bookieWidgetIdByProject(project) {
    if (project == "UA") return "bookmakers-ua";
    if (project == "BY") return "bookmakers-by";
    return "sportsbook";
}

export async function casinoWidgetIdByProject(project) {
    if (project == "UA") return "casino-ua";
    if (project == "BY") return "casino-by";
    return "casino-int";
}

export async function newsIdByProject(project) {
    if (project == "UA") return "1000000264324";
    if (project == "BY") return "1113043707";
    return "1000108131";
}