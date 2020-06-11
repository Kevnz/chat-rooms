const { inspect } = require('util')
const analytics = require('../services/analytics')
const POST_CATEGORY = 'MESSAGE POST'

const BROADCAST_CATEGORY = 'BROADCAST POST'
const VIDEOS_CATEGORY = 'ROOMS ACTION'

const VideoService = {
  rooms: [],
  joined: {},
  getAll: () => [],
  getRoom: slug => {
    return {
      id: slug,
    }
  },
  getInfo: slug => {},
  joinMeeting: (slug, info) => {},
  startMeeting: (slug, info) => {},
}

module.exports = [
  {
    method: 'GET',
    path: '/api/videos',
    config: {
      id: 'videos',
      handler: async (request, h) => {
        analytics.event(VIDEOS_CATEGORY, `Get All Rooms`)
        return VideoService.getAll()
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
        const room = await VideoService.getRoom(r.params.slug)
        const messages = await VideoService.getInfo(r.params.slug)
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
        VideoService.joinMeeting(r.params.slug, {
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
  // start a video call. This is called by host
  // this fires the created message
  {
    method: 'PUT',
    path: '/api/video-start/{slug}',
    config: {
      id: 'start-video',
      handler: (r, h) => {
        const keys = Object.keys(r.socket)
        console.log('id from socket', r.socket.id)
        console.log('info from socket', r.socket.info)
        console.log('request', inspect(keys, false, 4, true))
        analytics.event(VIDEOS_CATEGORY, `USER STARTED VIDEO ${r.params.slug}`)
        VideoService.startMeeting(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/api/videos/${r.params.slug}`, {
          action: 'created',
          user: r.payload.user,
          offerId: r.socket.id,
          offerInfo: r.socket.info,
          message: `User ${r.payload.user} offered to start video meeting`,
        })
        return { result: true }
      },
    },
  },
  {
    method: 'PUT',
    path: '/api/video-join/{slug}',
    config: {
      id: 'join-video-3',
      handler: (r, h) => {
        analytics.event(VIDEOS_CATEGORY, `USER JOINED VIDEO ${r.params.slug}`)
        console.log('request', inspect(r))
        VideoService.joinMeeting(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        r.server.publish(`/api/videos/${r.params.slug}`, {
          action: 'answer',
          user: r.payload.user,
          message: `User ${r.payload.user} answered a video meeting`,
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
        /*
        RoomService.addMessage(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        */
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
        /*
        RoomService.addMessage(r.params.slug, {
          ...r.payload,
          postedAt: Date.now(),
        })
        */
        r.server.publish(`/api/videos/${r.params.slug}`, r.payload)
        return { result: true }
      },
    },
  },
]
