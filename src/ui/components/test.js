import React, { useLayoutEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import './styles.css'

const useHover = rel => {
  const [hovered, setHover] = useState(false)
  useLayoutEffect(() => {
    const onHover = () => setHover(true)
    const offHover = () => setHover(false)
    rel.current.addEventListener('mouseover', onHover)
    rel.current.addEventListener('mouseout', offHover)
    return () => {
      console.log('the return cleanup thing')
      rel.current.removeEventListener('mouseover', onHover)

      rel.current.removeEventListener('mouseout', offHover)
    }
  }, [rel])
  return [hovered]
}

function App() {
  const elRef = useRef(null)
  const elRef2 = useRef(null)
  const [hovered] = useHover(elRef)
  const [other] = useHover(elRef2)
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h1 className={hovered ? 'animated infinite jello' : 'nope'} ref={elRef}>
        Example
      </h1>
      <h2 className={other ? 'animated infinite wobble' : 'nope'} ref={elRef2}>
        Start editing to see some magic happen!
      </h2>
    </div>
  )
}
