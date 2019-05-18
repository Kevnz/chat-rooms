const analytics = require('../services/analytics')

const rooms = ['general', 'random', 'code']
const POST_CATEGORY = 'MESSAGE POST'
const BROADCAST_CATEGORY = 'BROADCAST POST'
const ROOMS_CATEGORY = 'ROOMS GET'
module.exports = [
  {
    method: 'GET',
    path: '/broadcast',
    config: {
      handler: (r, h) => {
        analytics.event(BROADCAST_CATEGORY, `Broadcast called`)
        r.server.broadcast('welcome!')
        return { result: 'SENT' }
      },
    },
  },
  {
    method: 'GET',
    path: '/rooms',
    config: {
      id: 'rooms',
      handler: (request, h) => {
        analytics.event(ROOMS_CATEGORY, `Get All Rooms`)
        return { rooms }
      },
    },
  },
  {
    method: 'GET',
    path: '/rooms/{id}',
    config: {
      id: 'rooms-by-id',
      handler: (r, h) => {
        analytics.event(ROOMS_CATEGORY, `Get Room ${r.params.id}`)
        return r.params.id
      },
    },
  },
  {
    method: 'POST',
    path: '/rooms/{id}/message',
    config: {
      id: 'room-message',
      handler: (r, h) => {
        analytics.event(POST_CATEGORY, `Message Post to ${r.params.id}`)
        r.server.publish(`/rooms/${r.params.id}`, r.payload)
        return true
      },
    },
  },
]
