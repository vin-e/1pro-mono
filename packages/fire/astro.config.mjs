import { defineConfig } from 'astro/config';
import autoprefixer from 'autoprefixer';
import tailwind from "@astrojs/tailwind";
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [mdx(), tailwind()],
  trailingSlash: 'always',
  vite: {
    css: {
      postcss: {
        plugins: [
          autoprefixer({})
        ],
      }
    }
  }
});