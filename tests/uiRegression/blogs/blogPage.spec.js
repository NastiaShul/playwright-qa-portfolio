import { expect, test } from "@playwright/test";
import fs from "fs";
import { MainPage } from "../../../pages/main.page";
import { BlogPage } from "../../../pages/blog.page";
import { checkProject } from "../../api/utils/functions/checkProject";

const titleUa = "Трибуна Inside";
const titleBy = "Административный блог";
const titleInt = "What a hit son, what a hit!";

const breadcrumbUA = [
  "SportsApp",
  "Блоги",
  titleUa
];

const breadcrumbBy = [
  "SportsApp",
  "Блогі",
  titleBy
];

const breadcrumbINT = [
  "SportsApp",
  "Blogs",
  titleInt
];

const jsonLdBreadcrumbsUa = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Блоги",
      "item": "https://ua.example.com/uk/blogs/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Трибуна Inside"
    }
  ]
};

const jsonLdBreadcrumbsBy = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Блогі",
      "item": "https://by.example.com/be/blogs/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Административный блог"
    }
  ]
};

const jsonLdBreadcrumbsINT = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Blogs",
      "item": "https://example.com/en/blogs/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "What a hit son, what a hit!"
    }
  ]
};

const jsonLdArticleUa = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Трибуна Inside",
  "url": "https://ua.example.com/uk/blogs/trybuna-inside/",
  "description": "Про фічі, які тільки-но виходять на поле, і ті, що лишились у запасі",
  "image": "https://pictures.ua.example.com/image/e054ad91-3cb3-43d2-9349-c66ea4f2c2da",
  "creator": {
    "@type": "Person",
    "name": "Oleksii K",
    "url": "https://ua.example.com/uk/profile/ceac245d-4b36-4c9f-b167-c456a7a80a59/"
  },
  "publisher": {
    "@type": "NewsMediaOrganization",
    "name": "example.com",
    "url": "https://ua.example.com/uk/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ua.example.com/seo_logo_ua.svg",
      "width": 150,
      "height": 112
    },
    "sameAs": [
      "https://www.facebook.com/ua.sportsappcom",
      "https://www.instagram.com/sportsapp_ua/",
      "https://x.com/example",
      "https://www.tiktok.com/@example",
      "https://t.me/+Inh02alh9itjNjli",
      "https://apps.apple.com/ua/app/example/id621370793",
      "https://play.google.com/store/apps/details?id=com.example.app",
      "https://www.youtube.com/@SPORTSAPP_UA_FOOTBALL"
    ]
  },
  "blogPost": [
    {
      "@type": "BlogPosting",
      "headline": "Блоги повернулись! Створи власне медіа на «Трибуні»",
      "url": "https://ua.example.com/uk/blogs/3142611-blohy-povernulys/",
      "datePublished": "2025-07-31T22:45:00+03:00",
      "image": "https://pictures.ua.example.com/image/66a88188-65bb-4125-a558-88251c464602",
      "commentCount": 38,
      "author": {
        "@type": "Person",
        "name": "Oleksii K",
        "url": "https://ua.example.com/uk/profile/ceac245d-4b36-4c9f-b167-c456a7a80a59/",
        "description": "Прийшов, побачив, побідив",
        "jobTitle": "Редактор",
        "worksFor": {
          "@type": "NewsMediaOrganization",
          "name": "example.com",
          "url": "https://ua.example.com/uk/"
        }
      }
    }
  ]
};

const jsonLdArticleBy = {};

const jsonLdArticleINT = {};

const sessionValues = {
  webToAppShown: "false",
  bookmakerGiftPopupStatus: "close"
};

test.use({ userAgent: "UIAutotest" });

const BASE_URL = process.env.BASE_URL;
const project = await checkProject(BASE_URL);

test.beforeEach(async ({ context, page }) => {
  const mainPage = new MainPage(page);
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

  if (BASE_URL.includes("ua")) {
    await page.goto(BASE_URL + "uk/blogs/trybuna-inside/");
  } else if (BASE_URL.includes("by")) {
    await page.goto(BASE_URL + "be/blogs/adminblog/");
  } else {
    await page.goto(BASE_URL + "en/blogs/_what-a-hit-son-what-a-hit/");
  };
  
  await mainPage.acceptConsent();
});

test("Breadscrumbs should be displayed", async ({ page }) => {
  const mainPage = new MainPage(page);
  const crumbs = project === "UA"
    ? breadcrumbUA
    : project === "BY"
      ? breadcrumbBy
      : breadcrumbINT;

  await mainPage.checkItemsInBreadcrumbs(crumbs, project);

});

test("Header should be displayed", async ({ page }) => {
  const blogPage = new BlogPage(page);
  const title = project === "UA"
    ? titleUa
    : project === "BY"
      ? titleBy
      : titleInt;

  await blogPage.checkElementIsVisible(blogPage.blogPageHeader);
  // await blogPage.checkElementIsVisible(blogPage.blogPageHeaderBanner);
  await blogPage.checkElementIsVisible(blogPage.blogPageAvatar);
  await blogPage.checkElementIsVisible(blogPage.blogPageTitle, { name: title });
  await blogPage.checkElementIsVisible(blogPage.blogPageDescription);
  await blogPage.checkElementIsClickable(blogPage.blogPageFounderInfoLink);
});

test("Blog posts should be displayed", async ({ page }) => {
  const blogPage = new BlogPage(page);

  await blogPage.checkElementIsVisible(blogPage.blogPagePostsSection);
  await blogPage.checkElementIsClickable(blogPage.blogPagePostItem);

  await blogPage.checkElementIsClickable(blogPage.blogPagePostItemImage);
  await blogPage.checkElementIsClickable(blogPage.blogPagePostItemTitle);
  // await blogPage.checkElementIsClickable(blogPage.blogPagePostItemDescription);
  await blogPage.checkElementIsClickable(blogPage.blogPagePostItemPublishTime);
  await blogPage.checkElementIsClickable(blogPage.blogPagePostItemComment);
});


test("JSON ld check", async ({ page }) => {
  const expectedBreadcrumbs = project === "UA"
    ? jsonLdBreadcrumbsUa
    : project === "BY"
      ? jsonLdBreadcrumbsBy
      : jsonLdBreadcrumbsINT;

  const expectedArticle = project === "UA"
    ? jsonLdArticleUa
    : project === "BY"
      ? jsonLdArticleBy
      : jsonLdArticleINT;

  const breadcrumbText = await page.locator('#blogBreadcrumbsJsonLdData').textContent();
  const breadcrumbs = JSON.parse(breadcrumbText || '{}');
  expect(breadcrumbs).toEqual(expectedBreadcrumbs);

  // const articleText = await page.locator('#blogPageJsonLd').textContent();
  // const article = JSON.parse(articleText || '{}');
  // expect(article).toEqual(expectedArticle);
});

test("Canonical link should be correct", async ({ page }) => {
  const mainPage = new MainPage(page);
  await mainPage.checkCanonicalLink();
})

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const html = await page.content();
    const htmlPath = testInfo.outputDir + '/page-snapshot.html';

    fs.writeFileSync(htmlPath, html);
  }
});