const { Room } = require('../models')
const cache = require('./cache')

module.exports = {
  addMessage: async (room, message) => {
    cache.push(room, message)
  },
  joinRoom: async (room, data) => {
    cache.push(`${room}-join`, data)
  },
  getMessages: async room => {
    const messages = await cache.getHistory(room)
    console.info('message', messages)
    return messages
  },
  getAll: async () => {
    return cache.get('all-rooms', async () => {
      return Room.fetchAll()
    })
  },
}
