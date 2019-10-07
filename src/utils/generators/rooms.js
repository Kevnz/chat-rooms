const faker = require('faker')

const icons = [
  'inbox',
  'cocktail',
  'coffee',
  'flask',
  'highlighter',
  'layer-group',
  'tint',
  'calendar',
  'eye',
  'football-ball',
  'quidditch',
  'volleyball-ball',
  'radiation',
  'atom',
]

module.exports = id => {
  const roomName = faker.commerce.productName()
  const roomArr = roomName.split(' ')
  roomArr.pop()
  const icon = icons[Math.floor(Math.random() * icons.length)]

  return {
    id: id,
    name: roomArr.join(' '),
    description: faker.company.bs(),
    slug: faker.helpers.slugify(roomName).toLowerCase(),
    icon: icon,
  }
}
