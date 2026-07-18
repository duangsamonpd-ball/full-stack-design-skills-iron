import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Tailwind v4 is wired through the Vite plugin — no tailwind.config.js.
// The theme lives in src/styles/global.css via @theme / @theme inline.
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
