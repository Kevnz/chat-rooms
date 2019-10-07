const faker = require('faker')
const bcrypt = require('bcrypt')

module.exports = (id, role = 'user') => {
  const saltRounds = 10
  const salt = bcrypt.genSaltSync(saltRounds)
  const password = faker.internet.password()
  const hashedPassword = bcrypt.hashSync(password, salt)
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const username = faker.internet.userName(firstName, lastName).toLowerCase()

  return {
    id: id,
    firstName,
    lastName,
    username,
    email: faker.internet
      .email(firstName, lastName, 'example.com')
      .toLowerCase(),
    password,
    hashedPassword,
    avatar: `https://api.adorable.io/avatars/120/${username}.png`,
  }
}
