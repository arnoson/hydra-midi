// @ts-check

import { exposeToWindow } from '../utils'
import { midi } from './midi'
import { cc, _cc } from './cc'
import { note, _note } from './note'

exposeToWindow({ midi, cc, _cc, note, _note })
