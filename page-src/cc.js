import { chainable } from './utils'
import { scale, range } from './transforms'

export const ccValues = Array(128).fill(0.5)

export const _cc = index => ccValues[index]

export const cc = index => chainable(_cc, [index], { scale, range })
