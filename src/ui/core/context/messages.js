import React, { createContext, useReducer, useEffect } from 'react'
const initialState = {
  messages: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'received':
      return {}
    case 'sent':
      return {}
    default:
      return null
  }
}

export const MessagesContext = createContext()

export const MessagesProvider = ({ children }) => {
  const hydratedState = initialState
  const [state, dispatch] = useReducer(reducer, hydratedState)
  useEffect(() => {}, [state])

  return (
    <MessagesContext.Provider value={{ ...state }}>
      {children}
    </MessagesContext.Provider>
  )
}
