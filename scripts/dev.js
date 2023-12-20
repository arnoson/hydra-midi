import { startTunnel } from "untun";
import open, { apps } from 'open';

const browserFlagIndex = process.argv.indexOf('--browser')
const browser = browserFlagIndex !== -1
  ? process.argv[browserFlagIndex + 1]
  : undefined

const tunnel = await startTunnel({ port: 3000 });
const url = await tunnel.getURL()

const code = `await loadScript('${url}/index.js')
await midi.start({ channel: '*', input: '*' }).show()\n\n`
const encodedCode = btoa(encodeURIComponent(code))

const options = browser ? { app: { name: apps[browser] } } : undefined
open(`https://hydra.ojack.xyz/?code=${encodedCode}`, options);
