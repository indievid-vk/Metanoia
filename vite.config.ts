import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

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
    base: mode === 'production' ? '/Metanoia/' : '/',
    plugins: [react(), tailwindcss(), rootAssetsPlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
