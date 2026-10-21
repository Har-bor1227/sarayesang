بسته جایگزینی امنیتی سرای سنگ

محتویات این بسته مسیرهای نسبی متناظر با ریشه پروژه هستند:
- components/blog/WordPressArticleContent.tsx
- app/blog/[slug]/page.tsx (نسخه کامل صفحه؛ HTML قبل از عبور به Client Component پاک‌سازی می‌شود)
- components/product/detail/ProductDescription.tsx
- app/api/image-search/route.ts
- lib/security/sanitize-wordpress-html.ts (فایل جدید، فقط سمت سرور)
- package.json (نسخه کامل جایگزین)

مراحل نصب در ریشه پروژه:
  npm install
  npm run build
  npm run lint
  npm test

npm install فایل package-lock.json را با package.json جدید هماهنگ می‌کند.

نکات مهم:
1. HTML سمت سرور با sanitize-html پاک‌سازی می‌شود تا خروجی قبل از رندر SSR ایمن‌سازی شود. صفحه مقاله و توضیحات محصول هر دو از همین تابع استفاده می‌کنند.
2. iframe فقط برای embedهای HTTPS یوتیوب و Vimeo و مسیرهای /embed/ یا /video/ مجاز است. اگر وردپرس از میزبان ویدیویی دیگری استفاده می‌کند، قبل از انتشار باید همان میزبان مشخص و به allowlist اضافه شود.
3. inline style فقط با فهرست محدود و regexهای مجاز عبور می‌کند. بعد از جایگزینی ظاهر محتوای مقاله/محصول باید بررسی شود؛ اگر استایل خاص و معتبری حذف شد، باید همان خاصیت به‌صورت محدود و امن اضافه شود، نه اینکه همه styleها آزاد شوند.
4. API تصویر برای decode و بررسی ابعاد واقعی فایل به sharp نیاز دارد.
5. محدودسازی نرخ درخواست هنوز باید در لایه پایدار/لبه (مانند Vercel Firewall، Cloudflare یا Redis مشترک) پیاده‌سازی شود. شمارنده درون حافظه‌ای در Serverless قابل اتکا نیست و به‌عنوان راهکار کامل استفاده نشده است.
6. پس از جایگزینی، تصاویر/ویدیوهای مقالات، توضیحات محصولات، جدول‌ها، FAQ و جست‌وجوی تصویری را در مرورگر دوباره آزمایش کنید.
