require('xtconf')()
const Path = require('path')
const { ApolloServer } = require('apollo-server-hapi')
const Hapi = require('@hapi/hapi')
const Manifest = require('./manifest')
const Types = require('./graphql/types')
const Resolvers = require('./graphql/resolvers')
const analytics = require('./services/analytics')
let app

const start = async () => {
  try {
    const server = new ApolloServer({ typeDefs: Types, resolvers: Resolvers })
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
        onConnection: socket => {
          analytics.event('SocketOperation', 'SocketConnection')
        },
      },
    })
    await app.register(Manifest)
    await server.applyMiddleware({
      app,
    })

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
