// @ts-check

import { exposeToWindow } from './utils'
import { cc, _cc } from './hydra-functions/cc'
import { note, _note } from './hydra-functions/note'
import { midi } from './midi'

const hydraMidi = {
  start: () => midi.start(),
  pause: () => midi.pause()
}

exposeToWindow({ cc, _cc, note, _note, midi: hydraMidi })
