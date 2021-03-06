import React from 'react'
import { Router } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { Layout } from './layout'
import { AuthProvider } from './context/auth'
import { RoomsProvider } from './context/rooms'

const About = React.lazy(() => import('../pages/about'))
const Home = React.lazy(() => import('../pages/home'))
const Contact = React.lazy(() => import('../pages/contact'))
const Register = React.lazy(() => import('../pages/register'))
const Login = React.lazy(() => import('../pages/login'))
const Video = React.lazy(() => import('../pages/video'))
const Room = React.lazy(() => import('../pages/room'))
export const App = () => {
  return (
    <AuthProvider>
      <RoomsProvider>
        <Layout>
          <React.Suspense fallback={<div>Loading</div>}>
            <Router>
              <Home path="/" />
              <Login path="/login" />
              <Room path="/rooms/:slug" />
              <Video path="/video/:slug" />
              <About path="/about" />
              <Contact path="/contact" />
              <Register path="/register" />
              <Login path="/login" />
            </Router>
          </React.Suspense>
        </Layout>
      </RoomsProvider>
    </AuthProvider>
  )
}

export default hot(App)
