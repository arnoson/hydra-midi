// @ts-check

import { exposeToWindow } from './utils'
import { midi, cc, _cc, note, _note, _noteVelocity } from './hydra-api'
import state from './state'
exposeToWindow({ midi, cc, _cc, note, _note, _noteVelocity, midiState: state })
