// @ts-check

import { exposeToWindow } from './utils'
import { midi, cc, _cc, note, _note } from './hydra-api'

exposeToWindow({ midi, cc, _cc, note, _note })
