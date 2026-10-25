# Maneela — deploy ke Vercel

1. Ekstrak zip ini.
2. Cara cepat: buka vercel.com/new, pilih "Deploy" lalu drag folder `maneela`.
   Atau lewat CLI: `npm i -g vercel` lalu jalankan `vercel --prod` di dalam folder ini.
3. Framework preset: **Other**. Build command & output directory dikosongkan.

Catatan:
- Tailwind CSS dimuat via CDN di setiap halaman (`cdn.tailwindcss.com`). Untuk produksi serius, sebaiknya build Tailwind sendiri.
- Harga & promo di `assets/app.js` masih contoh, ganti dengan harga modal supplier.
- Isi nomor WhatsApp & email resmi di `bantuan/index.html`.
