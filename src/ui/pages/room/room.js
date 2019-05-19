import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import { useGet, usePut } from '@brightleaf/react-hooks'
import { AuthContext } from '../../core/context/auth'
import Room from '../../components/room'
import Message from '../../components/message'
const RoomPage = ({ slug }) => {
  const {
    state: { user },
  } = useContext(AuthContext)

  const { data, ...state } = useGet(`/api/rooms/${slug}`)
  console.log('state', state)
  console.log('data', data)
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
      {messages}
    </main>
  )
}
export default RoomPage
