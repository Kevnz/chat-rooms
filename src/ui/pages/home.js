import React, { useContext } from 'react'
import {
  Container,
  Section,
  Hero,
  HeroBody,
  Title,
  SubTitle,
} from '@brightleaf/elements'
import { useTitle } from '@brightleaf/react-hooks'
import { Link } from '@reach/router'
import Room from '../components/room'
import { RoomsContext } from '../core/context/rooms'

const RoomLinks = ({ rooms }) => {
  if (rooms.length === 0) {
    return <div>No Rooms</div>
  }
  return rooms.map(t => {
    return (
      <div key={`room-${t.id}`}>
        <Room {...t} />
        <Link to={`rooms/${t.slug}`}>Go</Link>
        <hr />
      </div>
    )
  })
}
export default () => {
  useTitle('The Chat Rooms - Home')
  const { rooms } = useContext(RoomsContext)

  return (
    <Container>
      <Hero>
        <HeroBody>
          <Title>Chat Rooms</Title>
          <SubTitle>Chatting on the web</SubTitle>
        </HeroBody>
      </Hero>
      <Section>
        <RoomLinks rooms={rooms} />
      </Section>
    </Container>
  )
}
