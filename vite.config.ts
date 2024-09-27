import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from '@vitejs/plugin-react' // Updated plugin for React
import dts from "vite-plugin-dts";
// import css
import 'tailwindcss'
import 'tailwindcss/defaultTheme'
import 'tailwindcss/colors'
// import scss

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    nodePolyfills({
      globals: {
        // Don't polyfill these globals
        global: false,
        process: false,
        Buffer: false
      },
    }),
    dts({
      insertTypesEntry: true,
      outDir: './dist/types'
    }),
    react()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // SCSS options
      }
    },
    postcss: {
      plugins: [
        require('tailwindcss'), // Make sure TailwindCSS is loaded here
        require('autoprefixer')
      ]
    }
  },
  build: {
    lib: {
      entry: 'src/index.ts', // or 'src/index.tsx' for JSX primary exports
      name: 'zorkin-sdk',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
