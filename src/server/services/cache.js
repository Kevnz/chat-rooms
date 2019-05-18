const Cache = require('@brightleaf/cache')
const cache = new Cache()

module.exports = {
  push: async (key, item) => {
    cache.client.lpush(key, item)
  },
  getHistory: async key => {
    const history = cache.client.lrange(key, 0, -1)
    console.info(key, history)
    return history
  },
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
