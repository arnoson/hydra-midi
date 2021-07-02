// @ts-check

import { exposeToWindow } from './utils'
import { midi, cc, _cc, note, _note } from './hydra-api'
import { initGui } from './gui'

initGui()
exposeToWindow({ midi, cc, _cc, note, _note })
