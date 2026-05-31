const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // Tailwind v4 PostCSS plugin - processes only files that import Tailwind
      // CSS Modules are handled separately by Next.js and won't be processed here
    },
  },
};

export default config;
