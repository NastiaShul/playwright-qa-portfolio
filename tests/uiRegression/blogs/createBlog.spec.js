import { test, expect } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../../../pages/auth.page";
import { BlogPage } from "../../../pages/blog.page";
import { MainPage } from "../../../pages/main.page";
import { checkProject } from "../../api/utils/functions/checkProject";
import { authState } from "../../../src/utils/uiAuthHelper";

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);
const url = `${BASE_URL}${project === "UA" ? "uk" : project === "BY" ? "be" : "fr"}`;

const sessionValues = {
  webToAppShown: "false",
  bookmakerGiftPopupStatus: "close"
};

test.use({ userAgent: "UIAutotest" });

const texts = {
  createBlogButton: {
    UA: "Створити блог",
    BY: "Стварыць блог",
    FR: "Écrire un blog",
  },
  uploadBanner: {
    UA: "Завантажити банер",
    BY: "Загрузіць банер",
    FR: "Télécharger la bannière",
  },
  addAvatar: {
    UA: "Завантажити зображення",
    BY: "Загрузіць выяву",
    FR: "Télécharger l'image",
  },
  titlePlaceholder: {
    UA: "Назва блогу",
    BY: "Назва блога",
    FR: "Titre du blog",
  },
  descriptionPlaceholder: {
    UA: "Короткий опис",
    BY: "Кароткае апісанне",
    FR: "Brève description",
  },
  saveButton: {
    UA: "Опублікувати",
    BY: "Апублiкаваць",
    FR: "Publier",
  },
};

test.beforeEach(async ({ context, page }) => {
  const mainPage = new MainPage(page);

  await authState(context, "user");

  const onboardingData = {
    time: Date.now(),
    data: { maxShows: 1, shownCount: 1 }
  };

  await context.addInitScript((values) => {
    Object.entries(values).forEach(([key, value]) => {
      sessionStorage.setItem(key, value);
    });
  }, sessionValues);

  await context.addInitScript((data) => {
    localStorage.setItem("subsOnboarding", JSON.stringify(data));
  }, onboardingData);

  await page.goto(url);
  await mainPage.acceptConsent();
});

test("Check blog page elements should be displayed", async ({ page, isMobile }) => {
  const loginPage = new LoginPage(page);
  const blogPage = new BlogPage(page);

  const createBlogButtonText = texts.createBlogButton[project] || texts.createBlogButton.FR;
  const uploadBannerText = texts.uploadBanner[project] || texts.uploadBanner.FR;
  const addAvatarText = texts.addAvatar[project] || texts.addAvatar.FR;
  const titlePlaceholder = texts.titlePlaceholder[project] || texts.titlePlaceholder.FR;
  const descriptionPlaceholder = texts.descriptionPlaceholder[project] || texts.descriptionPlaceholder.FR;
  const saveButtonText = texts.saveButton[project] || texts.saveButton.FR;

  await test.step("Open blog creation page", async () => {
    if (project === "INT") {
      if (isMobile) {
        await expect(loginPage.headerMenuIcon).toBeVisible();
        await loginPage.headerMenuIcon.click();
      }
      await expect(loginPage.loginUserProfileIcon).toBeVisible();
      await loginPage.loginUserProfileIcon.click();
      await blogPage.checkElementIsClickable(blogPage.blogCreateButtonInt, { name: createBlogButtonText });
      await blogPage.blogCreateButtonInt.click();
    } else {
      await loginPage.loginUserProfileIcon.click();
      await blogPage.checkElementIsClickable(blogPage.blogCreateButton, { name: createBlogButtonText });
      await blogPage.blogCreateButton.click();
    }
    await expect(page).toHaveURL(`${url}/blogs/_add/`);
  });

  await test.step("Check banner and avatar upload inputs", async () => {
    await blogPage.checkElementIsClickable(blogPage.blogCreateBannerInput, { name: uploadBannerText });
    await blogPage.checkElementIsClickable(blogPage.blogCreateAvatarInput);
    await blogPage.checkElementIsVisible(blogPage.blogCreateAvatarInputTitle, { name: addAvatarText });
  });

  await test.step("Check title and description inputs", async () => {
    await blogPage.checkElementIsClickable(blogPage.blogCreateTitleInput);
    await blogPage.checkElementIsClickable(blogPage.blogCreateDescriptionTextArea);

    await expect(blogPage.blogCreateTitleInput).toHaveAttribute("placeholder", titlePlaceholder);
    await expect(blogPage.blogCreateDescriptionTextArea).toHaveAttribute("placeholder", descriptionPlaceholder);
  });

  await test.step("Check save button", async () => {
    await blogPage.checkElementIsClickable(blogPage.blogCreateSaveButton, { name: saveButtonText });
  });

});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const html = await page.content();
    const htmlPath = testInfo.outputDir + '/page-snapshot.html';

    fs.writeFileSync(htmlPath, html);
  }
});