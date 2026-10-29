import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
