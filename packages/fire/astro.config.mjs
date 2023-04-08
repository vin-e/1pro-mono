import { defineConfig } from 'astro/config';
import autoprefixer from 'autoprefixer';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
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