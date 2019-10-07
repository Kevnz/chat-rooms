import React, { createContext, useEffect } from 'react'
import { useGet } from '@brightleaf/react-hooks'

export const RoomsContext = createContext()

export const RoomsProvider = ({ children }) => {
  const { data, error, loading, getUrl } = useGet('/api/rooms')
  useEffect(() => {
    getUrl()
  }, [])
  console.log('data', data)
  return (
    <RoomsContext.Provider value={{ rooms: data }}>
      {children}
    </RoomsContext.Provider>
  )
}
