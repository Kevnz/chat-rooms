const { Room } = require('../models')
const cache = require('./cache')

module.exports = {
  addMessage: async (room, message) => {
    cache.push(room, { ...message, type: 'message' })
  },
  joinRoom: async (room, data) => {
    cache.push(room, { ...data, type: 'system' })
  },
  getMessages: async room => {
    const messages = await cache.getHistory(room)
    return messages.map(m => JSON.parse(m))
  },
  getAll: async () => {
    return cache.get('all-rooms', async () => {
      return Room.fetchAll()
    })
  },
}
