import React from 'react'
import ReactDOM from 'react-dom'
import { Virtuoso } from 'react-virtuoso'
import faker from 'faker'
import './styles.css'
const items = []
const preloadImage = url => {
  var img = new Image()
  img.src = url
}
for (let index = 0; index < 1000; index++) {
  const imageUrl = faker.image.avatar()
  preloadImage(imageUrl)
  items.push({
    image: imageUrl,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,,
  })
}

function App() {
  return (
    <div className="App">
      <h1>Virtuoso</h1>

      <Virtuoso
        style={{ width: '300px', height: '400px', border: '1px solid black' }}
        totalCount={1000}
        item={index => (
          <div className="item">
            <img src={items[index].image} />
            Person: {items[index].name}
          </div>
        )}
      />
    </div>
  )
}
const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
