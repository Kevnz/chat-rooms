import React, { useContext, useState } from 'react'
import { Link } from '@reach/router'
import {
  BaseIcon,
  Box,
  Button,
  Card,
  CardImageContainer,
  CardBody,
  Column,
  Columns,
  Container,
  Content,
  Control,
  Field,
  Footer,
  Hero,
  HeroHead,
  HeroBody,
  HeroFooter,
  Image,
  Menu,
  MenuLabel,
  MenuList,
  MenuListItem,
  NavBar,
  NavBarEnd,
  NavBarMenu,
  NavBarBrand,
  NavBarBurger,
  NavBarDropDown,
  NavBarItem,
  NavBarDivider,
  Icon,
  Tile,
  Title,
  SubTitle,
  Tag,
  Tabs,
  TabItem,
} from '@brightleaf/elements'

import classnames from 'classnames'
import { AccountLink } from '../../components/account-link'
import { RoomsContext } from '../context/rooms'
import { AuthContext } from '../context/auth'
import './layout.scss'

const InboxTemplate = ({ children }) => {
  const [menu, setMenu] = useState(false)
  const { rooms } = useContext(RoomsContext)
  const { isLoggedIn } = useContext(AuthContext)

  const mappedRooms = rooms.map(room => {
    return (
      <MenuListItem key={room.slug}>
        <Link to={`/rooms/${room.slug}`} className="item">
          <span className="name">{room.name}</span>
        </Link>
      </MenuListItem>
    )
  })
  return (
    <>
      <NavBar className="has-shadow" isPrimary>
        <Container className="container">
          <NavBarBrand
            src="/chat-logo-invert.png"
            alt="Chatting"
            onClick={e => {
              setMenu(!menu)
            }}
          />

          <NavBarMenu className={classnames({ 'is-active': menu })}>
            <NavBarEnd className="navbar-end">
              {isLoggedIn && (
                <NavBarDropDown title="Account">
                  <NavBarItem>
                    <a>Dashboard</a>
                  </NavBarItem>
                  <NavBarItem>
                    <a>Profile</a>
                  </NavBarItem>
                  <NavBarItem>
                    <a>Settings</a>
                  </NavBarItem>
                  <NavBarDivider />
                  <NavBarItem>
                    <div>Logout</div>
                  </NavBarItem>
                </NavBarDropDown>
              )}
              {!isLoggedIn && (
                <NavBarDropDown title="Account">
                  <NavBarItem>
                    <Link to="/login">Login</Link>
                  </NavBarItem>
                  <NavBarItem>
                    <Link to="/register">Register</Link>
                  </NavBarItem>
                </NavBarDropDown>
              )}
            </NavBarEnd>
          </NavBarMenu>
        </Container>
      </NavBar>
      <Columns>
        <Column as="aside" is="2" isFullheight className="is-fullheight">
          <Menu className="section">
            <MenuLabel>Rooms</MenuLabel>
            <MenuList className="menu-list">{mappedRooms}</MenuList>
            <MenuLabel>Messages</MenuLabel>
          </Menu>
        </Column>
        <Column className="messages is-fullheight">{children}</Column>
      </Columns>
      <Footer>
        <Container>
          <Content hasTextCentered />
        </Container>
      </Footer>
    </>
  )
}

export { InboxTemplate }

export default InboxTemplate
