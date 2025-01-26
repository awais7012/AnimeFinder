import { defineConfig } from 'vite';
import { URL } from 'url';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/', // Update this if hosting in a subdirectory (e.g., '/animefinder/')
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Auto-updates service worker
      manifest: {
        name: 'AnimeFinder',
        short_name: 'Awais',
        start_url: '/', // Ensure this matches the base
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4CAF50',
        icons: [
          {
            src: '/icons/icon-1.png', // Correct type for webp
            type: 'image/png',
            sizes: '128x128'
          },
          {
            src: '/icons/avatar_15-128.png', // Correct type for webp
            type: 'image/png',
            sizes: '128x128'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => new URL(url).pathname.startsWith('/'),
            handler: 'CacheFirst', // Cache assets for offline use
            options: {
              cacheName: 'app-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
});
