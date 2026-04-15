import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Target modern browsers for smaller output
    target: 'es2020',

    // Manual chunk splitting — separate vendor code from app code so
    // updates to your pages don't invalidate the entire vendor cache.
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — rarely changes
          'vendor-react': ['react', 'react-dom', 'react-router'],

          // Animation library
          'vendor-motion': ['motion'],

          // i18n bundle
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],

          // Radix UI primitives — used by all shadcn components
          'vendor-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-accordion',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-slider',
            '@radix-ui/react-avatar',
            '@radix-ui/react-collapsible',
          ],

          // Charting (only loaded if a page uses recharts)
          'vendor-charts': ['recharts'],

          // Utility libraries
          'vendor-utils': ['axios', 'date-fns', 'clsx', 'class-variance-authority', 'tailwind-merge', 'sonner'],

          // Lucide icons — tree-shaken but still significant
          'vendor-icons': ['lucide-react'],
        },
      },
    },

    // Report compressed sizes to track optimization
    reportCompressedSize: true,

    // Increase the chunk warning limit slightly (default 500KB)
    chunkSizeWarningLimit: 600,

    // Enable CSS code splitting — each lazy route gets its own CSS chunk
    cssCodeSplit: true,
  },

  // Optimize dependency pre-bundling for dev speed
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'motion',
      'lucide-react',
      'axios',
      'sonner',
      'i18next',
      'react-i18next',
    ],
  },
})
