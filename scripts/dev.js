import { startTunnel } from 'untun'
import open, { apps } from 'open'

const browserFlagIndex = process.argv.indexOf('--browser')
const browser =
  browserFlagIndex !== -1 ? process.argv[browserFlagIndex + 1] : undefined

const tunnel = await startTunnel({ port: 3001 })
const tunnelUrl = await tunnel.getURL()

const code = `await loadScript('${tunnelUrl}/index.js')
await midi.start({ channel: '*', input: '*' }).show()\n\n`
const encodedCode = btoa(encodeURIComponent(code))

const hydraUrl = `https://hydra.ojack.xyz/?code=${encodedCode}`
console.log(`\x1b[34m\x1b[4m${hydraUrl}\x1b[0m`)
