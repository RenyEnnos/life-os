import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import { VitePWA } from 'vite-plugin-pwa'
import electron from 'vite-plugin-electron/simple'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isElectronMode = mode === 'electron'

  return {
    base: './',
    plugins: [
      react(),
      electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['node-schedule', 'electron-window-state', 'electron-store', 'better-sqlite3'],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web awareness APIs
        input: 'electron/preload.ts',
      },
      // PWA is not needed in Electron environment
      // developer can toggle it based on process.env
      }),
      VitePWA({
        disable: isElectronMode,
        registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Life OS',
        short_name: 'LifeOS',
        description: 'Your Life Operating System',
        theme_color: '#050505',
        start_url: '/',
        display: 'standalone',
        background_color: '#050505',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
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
      }),
      traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
      }),
      tsconfigPaths(),
    ],
    build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],

          // Animation libraries
          'animation': ['framer-motion'],

          // Data management
          'data': ['@tanstack/react-query', '@tanstack/react-query-persist-client', 'zustand'],

          // Backend services
          'backend': ['@supabase/supabase-js', 'groq-sdk'],

          // UI component libraries
          'ui-libs': ['lucide-react', 'date-fns'],

          // Form handling and validation
          'forms': ['zod'],

          // Internationalization
          'i18n': ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],

          // Charts and visualization
          'charts': ['recharts'],

          // Utilities
          'utils': ['axios', 'clsx', 'tailwind-merge', 'class-variance-authority'],
        },
        // Optimize chunk size
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/i.test(assetInfo.name || '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      }
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize build size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    },
    server: {
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
    },
    // Optimize dependencies
    test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/tests/e2e/**', '**/tests/performance/**', '**/node_modules/**'],
    },
    optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@tanstack/react-query',
      'zustand',
      'lucide-react',
      'react-i18next',
    ],
    },
  }
})
