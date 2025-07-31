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
  midiState: state,
})
