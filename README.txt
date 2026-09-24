SarayeSang Stone Finder v1 - fixed installer

Important:
The previous installer had an encoding/parser problem in Windows PowerShell.
This version is ASCII-only in the .ps1 installer and keeps the existing Smart Search WooCommerce function untouched.

It adds a separate WooCommerce loader named:
getAllProductsForStoneFinderFromWooCommerce

It changes:
- app/page.tsx: replace SmartSearchSection on the home page with StoneFinderSection directly after HeroSection.
- lib/repositories/stone-finder-repository.ts: use the dedicated Stone Finder loader.
- lib/woocommerce.ts: append the new dedicated loader; existing Smart Search loader is preserved.

New files:
- components/home/StoneFinderSection.tsx
- app/api/stone-finder/route.ts

Run from E:\Work\sarayesang:
powershell -ExecutionPolicy Bypass -File .\apply-stone-finder.ps1
npm run build
