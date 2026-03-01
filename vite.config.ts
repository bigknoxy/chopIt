import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png', 'assets/**/*'],
      manifest: {
        name: 'Chop it like it\'s HAWT',
        short_name: 'Chop HAWT',
        description: 'A relaxing incremental idle mobile game',
        theme_color: '#2E7D32',
        background_color: '#1B5E20',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          core: ['src/core/GameLoop.ts', 'src/core/StateManager.ts', 'src/core/EventBus.ts'],
          systems: ['src/systems/ChoppingSystem.ts', 'src/systems/TreeSystem.ts', 'src/systems/UpgradeSystem.ts'],
          data: ['src/data/index.ts']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});