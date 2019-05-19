const Cache = require('@brightleaf/cache')
const cache = new Cache()

module.exports = {
  push: async (key, item) => {
    console.info(cache)
    cache.redis.lpush(key, JSON.stringify(item))
  },
  getHistory: async key => {
    console.info(cache)
    const history = cache.redis.lrange(key, 0, -1)
    console.info(key, history)
    return JSON.parse(history)
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
