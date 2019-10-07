const { mapper } = require('@kev_nz/async-tools')
const { Room, User } = require('../models')
const cache = require('./cache')

module.exports = {
  addMessage: async (room, message) => {
    cache.push(room, { ...message, type: 'message' })
  },
  joinRoom: async (room, data) => {
    cache.push(room, { ...data, type: 'system' })
  },
  getRoom: async slug => {
    const room = new Room({ slug: slug })
    await room.fetch()
    return room
  },
  getMessages: async room => {
    const messages = await cache.getHistory(room)
    console.log('messages???', messages)
    const mapped = messages.map(m => JSON.parse(m))
    console.log('mapped???', mapped)
    const full = await mapper(mapped, async message => {
      console.log('message', message)
      try {
        const user = await new User({ username: message.user }).fetch({})
        message.fullUser = user.toJSON({
          hidden: ['firstName', 'lastName', 'email', 'password'],
        })
        return message
      } catch (err) {
        console.error(err)
        return message
      }
    })
    console.log('full', full)
    return full
  },
  getAll: async () => {
    return cache.get('all-rooms', async () => {
      return Room.fetchAll()
    })
  },
}
