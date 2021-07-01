// @ts-check

/**
 * Make a function chainable.
 * @param {function} fn The function.
 * @param {Record<string, function>} methods The methods that can be chained to
 * the function. Each entry in `methods` should actually be a method factory.
 * @returns
 */
export const chainable = (fn, methods) => {
  // Clone the function so we don't mutate the original.
  fn = fn.bind({})

  // Add methods that can be chained to the function. Each method gets a
  // reference to the function so it can call it and work with it's return
  // value.
  Object.entries(methods).forEach(([name, factory]) => (fn[name] = factory(fn)))

  return fn
}
