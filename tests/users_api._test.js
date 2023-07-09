const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')


describe('when there is a user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(helper.rootUser.password, 10)
    const user = new User({ username: helper.rootUser.username, passwordHash })

    await user.save()
  })

  test('add valid new user', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(helper.newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(helper.newUser.username)
  })

  test('fail with existing username', async () => {
    const usersAtStart = await helper.usersInDb()

    const userNameExist = {
      ...helper.newUser,
      username: helper.rootUser.username
    }

    const response = await api
      .post('/api/users')
      .send(userNameExist)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('fail with username less than 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const userNameShort = {
      ...helper.newUser,
      username: '2c'
    }

    const response = await api
      .post('/api/users')
      .send(userNameShort)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('is shorter than the minimum allowed length (3)')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('fail with password less than 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const userPassShort = {
      ...helper.newUser,
      password: '2c'
    }

    const response = await api
      .post('/api/users')
      .send(userPassShort)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('password less than 3 characters')

    const usersAtEnd = await helper.usersInDb()

    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
