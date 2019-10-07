const analytics = require('../services/analytics')
const RoomService = require('../services/rooms')
const POST_CATEGORY = 'MESSAGE POST'

const BROADCAST_CATEGORY = 'BROADCAST POST'
const ROOMS_CATEGORY = 'ROOMS ACTION'
module.exports = [
  {
    method: 'GET',
    path: '/api/rooms',
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
    path: '/api/rooms/{slug}',
    config: {
      id: 'rooms-by-slug',
      handler: async (r, h) => {
        analytics.event(ROOMS_CATEGORY, `Get Room ${r.params.slug}`)
        const room = await RoomService.getRoom(r.params.slug)
        const messages = await RoomService.getMessages(r.params.slug)
        console.log('messages', messages)
        console.log('room', room)
        return { room: room.toJSON(), messages }
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/rooms/{slug}',
    config: {
      id: 'join-room',
      handler: (r, h) => {
        analytics.event(ROOMS_CATEGORY, `USER JOINED ROOM ${r.params.slug}`)
        RoomService.joinRoom(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/api/rooms/${r.params.slug}`, {
          message: `User ${r.payload.user} joined`,
        })
        return { result: true }
      },
    },
  },
  {
    method: 'POST',
    path: '/api/rooms/{slug}/message',
    config: {
      id: 'room-message',
      handler: async (r, h) => {
        console.log('the messag eposted??', `|/api/rooms/${r.params.slug}|`)

        console.log('published?', r.payload)
        r.server.publish(`/api/rooms/${r.params.slug}`, r.payload)
        analytics.event(POST_CATEGORY, `Message Post to ${r.params.slug}`)
        RoomService.addMessage(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        // r.server.publish(`/api/rooms/${r.params.slug}`, r.payload)
        return { result: true }
      },
    },
  },

  {
    method: 'GET',
    path: '/api/rooms/{slug}/message',
    config: {
      id: 'room-message-get',
      handler: async (r, h) => {
        console.log('getter', r.params)
        console.log('getter payload', r.payload)

        await r.server.publish(`/api/rooms/${r.params.slug}`, r.payload)

        console.log('published?', r.payload)
        analytics.event(POST_CATEGORY, `Message Post to ${r.params.slug}`)
        RoomService.addMessage(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/api/rooms/${r.params.slug}`, r.payload)
        return { result: true }
      },
    },
  },
]
