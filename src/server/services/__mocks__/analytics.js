const methodMissing = function(object, missingMethod) {
  const proxyObject = new Proxy(object, {
    get(object, property) {
      if (Reflect.has(object, property)) {
        return Reflect.get(object, property)
      } else {
        return (...args) =>
          Reflect.apply(missingMethod, proxyObject, [property, ...args])
      }
    },
  })
  return proxyObject
}

const visitor = methodMissing(
  {
    event: () => null,
    pageview: () => null,
  },
  (method, ...args) => console.info(method, ...args)
)

module.exports = {
  page: (route, title) => {
    console.info('Mock Page Event')
  },
  event: (cat, action) => {
    console.info('Mock Event Event')
  },
  visitor,
}
