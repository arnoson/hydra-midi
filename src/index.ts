import { exposeToWindow } from './utils'
import {
  midi,
  cc,
  _cc,
  note,
  _note,
  _noteVelocity,
  aft,
  _aft,
  bend,
  _bend,
} from './hydra-api'
import state from './state'
exposeToWindow({
  midi,
  cc,
  _cc,
  note,
  _note,
  _noteVelocity,
  aft,
  _aft,
  bend,
  _bend,
  midiState: state,
})
