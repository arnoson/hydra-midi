import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'
import { fileURLToPath } from 'url'
import { string } from 'rollup-plugin-string'

// @see https://github.com/rollup/plugins/issues/1366
const __filename = fileURLToPath(import.meta.url)
global['__filename'] = __filename

export default defineConfig({
  input: 'src/index.js',
  output: {
    format: 'iife',
    file: 'dist/index.js',
  },
  plugins: [nodeResolve(), terser(), string({ include: '**/*.css' })],
})
