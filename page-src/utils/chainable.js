export const chainable = (fn, args, methods) => {
  const result = () => fn(...args)
  Object.entries(methods).forEach(
    ([name, factory]) => (result[name] = factory(result))
  )
  return result
}
