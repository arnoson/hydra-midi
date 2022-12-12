// @ts-check

import { exposeToWindow } from './utils'
import { midi, cc, _cc, note, _note } from './hydra-api'
import state from './state'
exposeToWindow({ midi, cc, _cc, note, _note, midiState: state })
