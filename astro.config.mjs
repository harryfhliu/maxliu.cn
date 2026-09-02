import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://maxliu.cn',
  trailingSlash: 'ignore',
  build: {
    assets: '_assets',
    inlineStylesheets: 'auto',
  },
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {},
    },
  },
});
