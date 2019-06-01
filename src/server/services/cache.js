const Cache = require('@brightleaf/cache')
const cache = new Cache({ redis: process.env.REDIS_URL })

module.exports = {
  push: async (key, item) => {
    cache.redis.lpush(key, JSON.stringify(item))
  },
  getHistory: async key => cache.redis.lrange(key, 0, -1),
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
