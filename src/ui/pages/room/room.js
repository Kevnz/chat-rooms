import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useGet, usePut, useNes } from '@brightleaf/react-hooks'
import { Button } from 'react-form-elements'
import { AuthContext } from '../../core/context/auth'
import MessageForm from '../../features/message-post'
import Room from '../../components/room'
import Message from '../../components/message'
const RoomPage = ({ slug }) => {
  const {
    state: { user },
  } = useContext(AuthContext)

  const { data, ...state } = useGet(`/api/rooms/${slug}`)
  const { postData: putData } = usePut(`/api/rooms/${slug}`)
  const { client, dispatcher } = useNes('ws://localhost:4567')

  console.log('message from the nes?', {
    client,
  })

  if (state.loading) {
    return 'loading'
  }
  if (state.error) {
    console.error(state.error)
    return 'bugger'
  }
  if (data === []) {
    return 'loading'
  }
  client.onUpdate = update => {
    console.info('onUpdate')
    dispatcher(update)
    // update -> 'welcome!'
  }
  console.log(`|/api/rooms/${slug}|`)

  client.subscribe(`/api/rooms/${slug}`, message => {
    console.log('subscribe?')
    dispatcher(message)
  })
  client.subscribe(`/rooms/${slug}`, message => {
    console.log('chat sub???')
    dispatcher(message)
  })
  client.onUpdate = update => {
    console.info('onUpdate')
    dispatcher(update)
    // update -> 'welcome!'
  }
  const messages = data.messages ? (
    data.messages.map((m, i) => (
      <Message
        key={`m-${i}-${m.postedAt}`}
        {...m}
        currentUser={user.username}
      />
    ))
  ) : (
    <div>No Messages</div>
  )
  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <title>The Chat Room - {data.room.name}</title>
      </Helmet>
      <h1>{data.room.name}</h1>
      <Room {...data.room} />

      <Button
        onClick={e => {
          e.preventDefault()
          putData({ user: user.username })
        }}
      >
        Join Room
      </Button>
      <MessageForm
        username={user.username}
        url={`/api/rooms/${slug}/message`}
      />
      {messages}
    </main>
  )
}
export default RoomPage
