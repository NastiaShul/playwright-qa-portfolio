
Id
Title
[WEB][SEO] Сторінка «Написати пост» — noindex, без hreflang, 403 для гостя
Section id
Priority id
2
Type id
Refs
Spec file
tests/seo/blogs/createPost.seo.spec.js
[WEB][SEO] Сторінка «Написати пост» — noindex, без hreflang, 403 для гостя
Preconditions
Оточення: stage. Мовні версії: UA — ru (без префікса), uk; BY — ru (без префікса), be; INT — en, de, fr, it, es, ar, pt-br, pl.
Користувач user з auth-token.json.
{lang?} — мовний префікс, для ru відсутній.

Steps
 Action: Авторизуватися користувачем user і відкрити сторінку /{lang?}/blogs/create-post/.

Expected:

В URL автоматично підставляється id блогу — URL відповідає шаблону /{lang?}/blogs/create-post/{id}/.
 Action: Перевірити директиви robots у <head> (meta[name="robots"]) та в HTTP-заголовку X-Robots-Tag.

Expected:

Присутня директива noindex.
 Action: Перевірити теги link[rel="alternate"][hreflang] у <head>.

Expected:

Теги hreflang відсутні.
 Action: Без авторизації (гість) відкрити сторінку /{lang?}/blogs/create-post/.

Expected:

Сторінка віддає статус 403.
Expected Results
Сторінка «Написати пост» доступна лише авторизованому користувачу, URL відповідає шаблону /blogs/create-post/{id}/, сторінка закрита від індексації (noindex), не містить hreflang; гість отримує 403.