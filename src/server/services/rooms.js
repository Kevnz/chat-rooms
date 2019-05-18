const { Room, Rooms } = require('../models')
const cache = require('./cache')

module.exports = {
  addMessage: async () => {},
  getAll: async () => {
    const rooms = await cache.get('all-rooms', async () => {
      console.log('Room', Rooms)
      const rooms = await Rooms.fetch()
      console.log('rooms', rooms)
    })
    console.info('Rooms', rooms)
    return rooms
  },
}
