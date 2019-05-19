const analytics = require('../services/analytics')
const RoomService = require('../services/rooms')
const POST_CATEGORY = 'MESSAGE POST'

const BROADCAST_CATEGORY = 'BROADCAST POST'
const ROOMS_CATEGORY = 'ROOMS ACTION'
module.exports = [
  {
    method: 'GET',
    path: '/rooms',
    config: {
      id: 'rooms',
      handler: async (request, h) => {
        analytics.event(ROOMS_CATEGORY, `Get All Rooms`)
        return RoomService.getAll()
      },
    },
  },
  {
    method: 'GET',
    path: '/rooms/{slug}',
    config: {
      id: 'rooms-by-slug',
      handler: async (r, h) => {
        analytics.event(ROOMS_CATEGORY, `Get Room ${r.params.slug}`)
        const messages = await RoomService.getMessages(r.params.slug)
        console.info('messages', messages)
        return messages
      },
    },
  },
  {
    method: 'PUT',
    path: '/rooms/{slug}',
    config: {
      id: 'join-room',
      handler: (r, h) => {
        analytics.event(ROOMS_CATEGORY, `USER JOINED ROOM ${r.params.slug}`)
        RoomService.joinRoom(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/rooms/${r.params.slug}`, {
          message: `User ${r.payload.user} joined`,
        })
        return true
      },
    },
  },
  {
    method: 'POST',
    path: '/rooms/{slug}/message',
    config: {
      id: 'room-message',
      handler: (r, h) => {
        analytics.event(POST_CATEGORY, `Message Post to ${r.params.slug}`)
        RoomService.addMessage(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/rooms/${r.params.slug}`, r.payload)
        return true
      },
    },
  },
]
