import { HydraContext } from '../types'

export type TransformFunction = (ctx: HydraContext) => number
export type TransformFactory = (
  fn: Function,
) => (min?: number, max?: number) => any
