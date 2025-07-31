type ChainableMethodFactories = Record<string, (fn: Function) => Function>

export type ChainableMethods<M extends ChainableMethodFactories> = {
  [K in keyof M]: ReturnType<M[K]>
}

/** Make a function chainable. */
export const chainable = <
  F extends Function,
  M extends ChainableMethodFactories,
>(
  fn: F,
  methods: M,
): F & ChainableMethods<M> => {
  // Copy the function so we don't mutate the original.
  const copy = fn.bind({}) as F & ChainableMethods<M>

  // Add methods that can be chained to the function. Each method gets a
  // reference to the function so it can call it and work with it's return
  // value.
  Object.entries(methods).forEach(
    ([name, factory]: [keyof M, Function]) => (copy[name] = factory(fn)),
  )

  return copy
}
