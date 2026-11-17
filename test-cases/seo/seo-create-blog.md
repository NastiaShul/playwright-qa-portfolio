Id
Title
[WEB][SEO] Сторінка «Створити блог» — noindex, без hreflang, 403 для гостя
Section id
Priority id
2
Type id
Refs
Spec file
tests/seo/blogs/createBlog.seo.spec.js
[WEB][SEO] Сторінка «Створити блог» — noindex, без hreflang, 403 для гостя
Preconditions
Оточення: stage. Мовні версії: UA — ru (без префікса), uk; BY — ru (без префікса), be; INT — en, de, fr, it, es, ar, pt-br, pl.
Користувач user з auth-token.json.
{lang?} — мовний префікс, для ru відсутній.

Steps
 Action: Авторизуватися користувачем user і відкрити сторінку /{lang?}/blogs/_add/.

Expected:

Відображається форма створення блогу.
Редиректу немає — URL збігається з шаблоном /{lang?}/blogs/_add/.
 Action: Перевірити директиви robots у <head> (meta[name="robots"]) та в HTTP-заголовку X-Robots-Tag.

Expected:

Присутня директива noindex.
 Action: Перевірити теги link[rel="alternate"][hreflang] у <head>.

Expected:

Теги hreflang відсутні.
 Action: Без авторизації (гість) відкрити сторінку /{lang?}/blogs/_add/.

Expected:

Сторінка віддає статус 403.
Expected Results
Сторінка «Створити блог» доступна лише авторизованому користувачу, закрита від індексації (noindex), не містить hreflang; гість отримує 403.