import { defineConfig } from 'tsup'

export default defineConfig({
  loader: { '.css': 'text' },
  format: 'iife',
  entry: ['src/index.js'],
  target: 'es2022',
  minify: 'terser',
  outExtension: () => ({ js: '.js' }),
})
