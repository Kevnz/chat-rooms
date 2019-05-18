const faker = require('faker')

module.exports = id => {
  const roomName = faker.company.catchPhrase()
  return {
    id: id,
    name: roomName,
    description: faker.company.bs(),
    slug: faker.helpers.slugify(roomName).toLowerCase(),
  }
}
