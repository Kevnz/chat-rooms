const Cache = require('@brightleaf/cache')
const cache = new Cache()

module.exports = {
  get: async (key, getter) => {
    const fromCache = await cache.get(key)
    if (!fromCache) {
      const results = await getter()
      cache.set(key, results)
      return results
    }
    return fromCache
  },
}
