import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  loader: { '.css': 'text' },
  format: 'iife',
  entry: ['src/index.ts'],
  target: 'es2022',
  minify: options.watch ? false : 'terser',
  dts: !options.watch,
  outExtension: () => ({ js: '.js' }),
}))
