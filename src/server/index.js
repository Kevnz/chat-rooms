require('xtconf')()
const Path = require('path')
const Hapi = require('@hapi/hapi')
const Manifest = require('./manifest')

const analytics = require('./services/analytics')
let app

const start = async () => {
  try {
    app = Hapi.server({
      port: process.env.PORT,
      routes: {
        files: {
          relativeTo: Path.join(__dirname, 'public'),
        },
        cors: {
          origin: ['*'],
          additionalHeaders: ['x-media-server', 'content-type'],
        },
      },
    })
    await app.register({
      plugin: require('@hapi/nes'),
      options: {
        onMessage: async message => {
          console.info('onMessage', message)
        },
        onConnection: socket => {
          console.log('onConnect')
          analytics.event('SocketOperation', 'SocketConnection')
        },
      },
    })

    await app.register(Manifest)
    app.subscription('/api/rooms/general')
    app.subscription('/rooms/{id}')
    app.subscription('/api/rooms/{id}')
    app.subscription('/api/videos/{id}')

    await app.start()
    analytics.event('ServerOperation', 'ServerStart')
  } catch (err) {
    console.error(err)
    analytics.event('ServerOperation', 'ServerFail')
    process.exit(1)
  }
  console.log('🚀 Server running')
}

process.on('SIGINT', async () => {
  console.log('stopping server')
  try {
    await app.stop({ timeout: 10000 })
    console.warn('The server has stopped 🛑')
    analytics.event('ServerOperation', 'ServerStopped')
    process.exit(0)
  } catch (err) {
    console.error('shutdown server error', err)
    analytics.event('ServerOperation', 'ServerStoppedFail')
    process.exit(1)
  }
})

start()
