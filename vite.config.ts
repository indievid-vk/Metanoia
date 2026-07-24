import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const rootAssetsPlugin = () => {
  return {
    name: 'root-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        try {
          const url = new URL(req.url, 'http://localhost');
          const match = url.pathname.match(/^\/(images|books|icons)\/(.+)$/);
          if (match) {
            const filename = match[2];
            const rootPath = path.resolve(__dirname, filename);
            if (fs.existsSync(rootPath)) {
              req.url = `/${filename}`;
            }
          }
        } catch (e) {
          // ignore invalid URLs
        }
        next();
      });
    },
    generateBundle() {
      const exts = ['.webp', '.epub', '.fb2', '.ttf', '.png'];
      const files = fs.readdirSync(__dirname);
      files.forEach(file => {
        if (exts.some(ext => file.toLowerCase().endsWith(ext))) {
          const content = fs.readFileSync(path.resolve(__dirname, file));
          let folder = '';
          if (file.toLowerCase().endsWith('.webp') || file.toLowerCase().endsWith('.png')) {
            if (file.toLowerCase().startsWith('icon_')) folder = 'icons/';
            else folder = 'images/';
          } else if (file.toLowerCase().endsWith('.epub') || file.toLowerCase().endsWith('.fb2')) {
            folder = 'books/';
          } else if (file.toLowerCase().endsWith('.ttf')) {
            folder = 'fonts/';
          }

          this.emitFile({
            type: 'asset',
            fileName: `${folder}${file}`,
            source: content
          });
        }
      });
    }
  };
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [
      react(), 
      tailwindcss(), 
      rootAssetsPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script-defer',
        devOptions: {
          enabled: true
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'icon_192.png', 'icon_512.png', 'manifest.json'],
        manifest: {
          name: 'Помощь кающимся',
          short_name: 'Кающимся',
          description: 'Дневник для подготовки к исповеди и духовная литература',
          theme_color: '#C33B3B',
          background_color: '#F4EBD8',
          display: 'standalone',
          icons: [
            {
              src: 'icon_192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'icon_512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'icon_512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
        workbox: {
          clientsClaim: true,
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,epub,fb2,ttf,woff,woff2,json}'],
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: /^\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 3,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif|ttf|woff|woff2|epub|fb2)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'static-assets-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 365
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
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
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
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
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR === 'true' ? false : { overlay: false },
    },
  };
});
