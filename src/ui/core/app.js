import React from 'react'
import { Router } from '@reach/router'
import { hot } from 'react-hot-loader/root'
import { Layout } from './layout'
import { AuthProvider } from './context/auth'
import { ErrorBoundary } from './boundary'

const About = React.lazy(() => import('../pages/about'))
const Home = React.lazy(() => import('../pages/home'))
const Contact = React.lazy(() => import('../pages/contact'))
const Register = React.lazy(() => import('../pages/register'))
const Login = React.lazy(() => import('../pages/login'))
const Room = React.lazy(() => import('../pages/room'))
export const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Layout>
          <ErrorBoundary>
            <React.Suspense fallback={<div>Loading</div>}>
              <Router>
                <Home path="/" />
                <Room path="/rooms/:slug" />
                <About path="/about" />
                <Contact path="/contact" />
                <Register path="/register" />
                <Login path="/login" />
              </Router>
            </React.Suspense>
          </ErrorBoundary>
        </Layout>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default hot(App)
