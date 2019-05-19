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
    const messages = cache.getHistory(room)
    console.info('message', messages)
  },
  getAll: async () => {
    const rooms = await cache.get('all-rooms', async () => {
      const rooms = await Room.fetchAll()
      console.log('rooms', rooms)
      return rooms
    })
    console.info('Rooms', rooms)
    return rooms
  },
}
