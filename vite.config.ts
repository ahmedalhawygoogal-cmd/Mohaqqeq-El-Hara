import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: '/Mohaqqeq-El-Hara/', // <--- تعديل 1: ضفنا السطر ده هنا
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'favicon.svg',
          'apple-touch-icon.png',
          'icon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
        ],
        manifest: {
          id: '/Mohaqqeq-El-Hara/', // <--- تعديل 2
          name: 'محقق الحارة - لغز أزقة المعز',
          short_name: 'محقق الحارة',
          description: 'محقق الحارة - كل دليل له حكاية. لعبة تحقيق جنائي تفاعلية غامضة في أزقة القاهرة القديمة.',
          theme_color: '#0e0c0b',
          background_color: '#0e0c0b',
          display: 'standalone',
          orientation: 'any',
          start_url: '/Mohaqqeq-El-Hara/', // <--- تعديل 3
          scope: '/Mohaqqeq-El-Hara/', // <--- تعديل 4
          lang: 'ar',
          dir: 'rtl',
          categories: ['games', 'entertainment'],
          icons: [
            {
              src: '/Mohaqqeq-El-Hara/pwa-192x192.png', // <--- تعديل 5
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/Mohaqqeq-El-Hara/pwa-512x512.png', // <--- تعديل 6
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/Mohaqqeq-El-Hara/pwa-maskable-512x512.png', // <--- تعديل 7
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,mp3}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
