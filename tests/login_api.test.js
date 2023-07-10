const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const { User, Session, UserReading, Blog } = require('../models')
const helper = require('./test_helper')

beforeEach(async () => {
  try {
    await Session.destroy({
      where: {},
    })

    await UserReading.destroy({
      where: {},
    })

    await Blog.destroy({
      where: {},
    })

    await User.destroy({
      where: {},
    })
  } catch(error) {
    console.log(error)
  }

  const passwordHash = await bcrypt.hash(helper.rootUser.password, 10)
  await User.create({
    username: helper.rootUser.username,
    name: helper.rootUser.name,
    passwordHash
  })


})

test('test valid login token', async () => {
  const user = { ...helper.rootUser }
  delete user.name

  const response = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const body = response.body

  expect(body.username).toBe(helper.rootUser.username)
  expect(body.name).toBe(helper.rootUser.name)

  expect(jwt.verify(body.token, process.env.SECRET))
})

test('fail with invalid login with wrong password', async () => {
  const user = { ...helper.rootUser, password: 'wrong' }
  delete user.name

  await api
    .post('/api/login')
    .send(user)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('fail with invalid login with unknown user', async () => {
  const user = { ...helper.rootUser, username: 'wrong' }
  delete user.name

  await api
    .post('/api/login')
    .send(user)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})
