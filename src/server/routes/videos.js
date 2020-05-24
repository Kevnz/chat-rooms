const analytics = require('../services/analytics')
const RoomService = require('../services/rooms')
const POST_CATEGORY = 'MESSAGE POST'

const BROADCAST_CATEGORY = 'BROADCAST POST'
const VIDEOS_CATEGORY = 'ROOMS ACTION'
module.exports = [
  {
    method: 'GET',
    path: '/api/videos',
    config: {
      id: 'videos',
      handler: async (request, h) => {
        analytics.event(VIDEOS_CATEGORY, `Get All Rooms`)
        return RoomService.getAll()
      },
    },
  },
  {
    method: 'GET',
    path: '/api/videos/{slug}',
    config: {
      id: 'video-by-slug',
      handler: async (r, h) => {
        analytics.event(VIDEOS_CATEGORY, `Get Room ${r.params.slug}`)
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
    path: '/api/videos/{slug}',
    config: {
      id: 'join-video',
      handler: (r, h) => {
        analytics.event(VIDEOS_CATEGORY, `USER JOINED ROOM ${r.params.slug}`)
        RoomService.joinRoom(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/api/videos/${r.params.slug}`, {
          action: 'joined',
          user: r.payload.user,
          message: `User ${r.payload.user} joined`,
        })
        return { result: true }
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/video-start/{slug}',
    config: {
      id: 'start-video',
      handler: (r, h) => {
        analytics.event(VIDEOS_CATEGORY, `USER STARTED ROOM ${r.params.slug}`)
        RoomService.joinRoom(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/api/videos/${r.params.slug}`, {
          action: 'started',
          user: r.payload.user,
          message: `User ${r.payload.user} started`,
        })
        return { result: true }
      },
    },
  },
  {
    method: 'POST',
    path: '/api/videos/{slug}/message',
    config: {
      id: 'video-message',
      handler: async (r, h) => {
        console.log('the messag eposted??', `|/api/videos/${r.params.slug}|`)

        console.log('published?', r.payload)
        r.server.publish(`/api/videos/${r.params.slug}`, r.payload)
        analytics.event(POST_CATEGORY, `Message Post to ${r.params.slug}`)
        RoomService.addMessage(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        // r.server.publish(`/api/videos/${r.params.slug}`, r.payload)
        return { result: true }
      },
    },
  },

  {
    method: 'GET',
    path: '/api/videos/{slug}/message',
    config: {
      id: 'videos-message-get',
      handler: async (r, h) => {
        console.log('getter', r.params)
        console.log('getter payload', r.payload)

        await r.server.publish(`/api/videos/${r.params.slug}`, r.payload)

        console.log('published?', r.payload)
        analytics.event(POST_CATEGORY, `Message Post to ${r.params.slug}`)
        RoomService.addMessage(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/api/videos/${r.params.slug}`, r.payload)
        return { result: true }
      },
    },
  },
]
