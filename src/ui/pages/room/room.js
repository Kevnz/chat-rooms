import React, { useContext, useEffect, useState } from 'react'

import {
  useGet,
  usePost,
  usePut,
  useTitle,
  useAsync,
} from '@brightleaf/react-hooks'
import {
  Button,
  Container,
  Hero,
  HeroBody,
  Title,
  SubTitle,
} from '@brightleaf/elements'

import { useNes } from '../../hooks/use-nes'
import { AuthContext } from '../../core/context/auth'
import MessageForm from '../../features/message-post'
import Room from '../../components/room'
import Message from '../../components/message'

const MessageCard = ({ active, ...msg }) => {
  return (
    <Card onClick={msg.onClick} className={active ? 'active' : ''}>
      <CardBody>
        <div className="msg-header">
          <span className="msg-from">
            <small>From: {msg.from}</small>
          </span>
          <span className="msg-timestamp">
            {new Date(msg.timestamp).toDateString()}
          </span>
          <span className="msg-attachment">
            <i className="fa fa-paperclip" />
          </span>
        </div>
        <div className="msg-subject">
          <span className="msg-subject">
            <strong>{msg.subject}</strong>
          </span>
        </div>
        <div className="msg-snippet">
          <p>{msg.snippet}</p>
        </div>
      </CardBody>
    </Card>
  )
}

const RoomPage = ({ slug }) => {
  const ctx = useContext(AuthContext)
  const user = ctx.user
  console.log('the user', user)
  console.log('the others', ctx)
  const url = `/api/rooms/${slug}`
  const [inRoom, setInRoom] = useState(false)
  const { data, getUrl } = useGet(`/api/rooms/${slug}`)
  const { messages, error, connecting, connected, client } = useNes(
    'ws://localhost:4567/',
    `/api/rooms/${slug}`
  )

  const { postData } = usePost(`/api/rooms/${slug}/message`)
  const { putData } = usePut(`/api/rooms/${slug}`)

  useEffect(() => {
    getUrl()
    return function cleanup() {
      console.log('cleanup', inRoom)
      if (inRoom) {
        putData({ user: user.username, message: 'Left room' })
        setInRoom(false)
      }
    }
  }, [slug])

  console.info('NES MEssages', messages)
  console.info('data MEssages', data.messages)
  const mergedMessages =
    data.messages && messages ? [].concat(data.messages).concat(messages) : []
  const messagesFromServer = data.messages ? (
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

  const messagesFromNes = messages ? (
    messages.map((m, i) => (
      <Message
        key={`m-${i}-${m.postedAt}`}
        {...m}
        currentUser={user.username}
      />
    ))
  ) : (
    <div>No Messages</div>
  )

  const merged = mergedMessages
    .sort((a, b) => {
      if (a.postedAt > b.postedAt) return 1
      if (a.postedAt < b.postedAt) return -1
      return 0
    })
    .map((m, i) => {
      // console.log('message', m)
      return (
        <Message
          key={`m-${i}-${m.postedAt}`}
          {...m}
          currentUser={user.username}
          fullUser
        />
      )
    })
  console.log('room data', data)

  return (
    <Container>
      <Hero>
        <Container>
          <Title is="4">{data.room && data.room.name}</Title>
          <Button
            disabled={inRoom}
            onClick={e => {
              e.preventDefault()
              putData({ user: user.username, message: 'Joined room' })
              setInRoom(true)
            }}
          >
            Join Room
          </Button>
        </Container>
      </Hero>

      <br />
      <hr />
      <Container>
        {merged}
        <br />
        <hr />
        <MessageForm
          username={user.username}
          onSubmit={async e => {
            console.log('e', e)

            postData(e)
          }}
        />
      </Container>
    </Container>
  )
}
export default RoomPage
