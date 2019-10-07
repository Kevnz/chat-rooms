import React from 'react'
import {
  Container,
  Section,
  Hero,
  HeroBody,
  Title,
  SubTitle,
} from '@brightleaf/elements'
import { useTitle } from '@brightleaf/react-hooks'
export default () => {
  useTitle('About Chat Rooms')
  return (
    <Container>
      <Hero>
        <HeroBody>
          <Title>Chat-Rooms</Title>
          <SubTitle>Chatting on the web</SubTitle>
        </HeroBody>
      </Hero>
      <Section>Put something here</Section>
    </Container>
  )
}
