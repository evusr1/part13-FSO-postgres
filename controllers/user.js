const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()

const { User, Blog } = require('../models')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if(password.length < 3)
    return response.status(400).send({ error: 'password less than 3 characters' })

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    name,
    passwordHash,
  })

  if(!user)
    return response.status(400).end()

  response.status(201).json(user)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .findAll({
      include: {
        model: Blog
      },
      attributes: { exclude: ['userId'] }
    })

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['id', 'isRead'],
          as: 'readinglists'
        }
      }
    ]
  })

  if(!user)
    return response.status(404).end()

  response.json(user)
})

usersRouter.post('/:username', async (request, response) => {
  const { username } = request.body
  const user = await User.findOne({
    where: {
      username: request.params.username
    },
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: []
        }
      }
    ]
  })

  if(!user)
    return response.status(404).end()

  user.username = username
  await user.save()

  response.json(user)
})
module.exports = usersRouter