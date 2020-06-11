import EventEmitter from 'events'
import { useEffect } from 'react'
import Nes from '@hapi/nes/lib/client'

const useNesEvents = (url = 'ws://localhost:4567', subscribe) => {
  var client = new Nes.Client(url)
  const emitter = new EventEmitter()
  useEffect(() => {
    const connectClient = async () => {
      emitter.emit('connecting')

      return new Promise(async resolve => {
        client.onConnect = () => {
          emitter.emit('connected')
          return resolve()
        }
        client.onDisconnect = () => {
          emitter.emit('disconnected')
          return resolve()
        }
        await client.connect()

        client.onUpdate = update => {
          console.log('on update client')
          emitter.emit(update.action || 'message', { data: update })
          return resolve()
        }

        if (subscribe) {
          client.subscribe(subscribe, update => {
            console.info('subscribe???', subscribe)
            console.info('sub update', update)
            emitter.emit(update.action || 'message', { data: update })
            return resolve()
          })
        }
      })
    }
    connectClient()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { client, emitter }
}

export { useNesEvents }
export default useNesEvents
