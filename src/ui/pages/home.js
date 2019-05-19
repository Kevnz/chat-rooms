import React from 'react'
import { Helmet } from 'react-helmet'
import { useGet } from '@brightleaf/react-hooks'
import { Link } from '@reach/router'
import Room from '../components/room'

export default () => {
  const { data, error, loading } = useGet('/api/rooms')
  if (loading) {
    return 'loading'
  }
  if (error) {
    console.error(error)
    return 'bugger'
  }
  const rooms = data.map(t => {
    return (
      <div key={`room-${t.id}`}>
        <Room {...t} />
        <Link to={`rooms/${t.slug}`}>Go</Link>
      </div>
    )
  })
  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <title>The Chat Rooms - Home</title>
      </Helmet>
      <h1>Rooms</h1>
      {rooms}
    </main>
  )
}
