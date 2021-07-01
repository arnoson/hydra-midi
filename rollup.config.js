import { defineConfig } from 'rollup'
import { chromeExtension, simpleReloader } from 'rollup-plugin-chrome-extension'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { string } from 'rollup-plugin-string'

export default defineConfig([
  {
    input: 'src/page-script/index.js',
    output: {
      format: 'esm',
      file: 'src/page-script-bundle.js.txt'
    },
    plugins: [nodeResolve()]
  },
  {
    input: 'src/manifest.json',
    output: {
      dir: 'dist',
      format: 'esm'
    },
    plugins: [
      string({ include: '**/*.txt' }),
      chromeExtension(),
      simpleReloader()
    ]
  }
])
