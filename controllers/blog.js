const blogRouter = require('express').Router()

const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const logger = require('../utils/logger')

const { userExtractor } = require('../utils/middleware')

const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id)
  next()
}

blogRouter.get('/', async (request, response) => {
  let where = {}

  if(request.query.search) {
    where = {
      [Op.or]: {
        title:{
          [Op.substring]: request.query.search
        },
        author:{
          [Op.substring]: request.query.search
        }
      }
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    order: [
      ['likes', 'DESC']
    ],
    where
  })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  if(!user)
    return response.status(401).json({ error: 'invalid user' })

  const blog = await Blog.create({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    userId: user.id
  })


  response.status(201).json(blog)
})

blogRouter.delete('/:id', [  blogFinder, userExtractor ], async (request, response) => {
  if(!request.blog)
    return response.status(404).end()

  const user = request.user

  if(request.blog.userId.toString() !== user.id.toString())
    return response.status(401).json({ error: 'token invalid' })

  await request.blog.destroy()

  response.status(204).end()
})


blogRouter.put('/:id', blogFinder, async (request, response) => {
  if(!request.blog)
    return request.status(404).end()

  const body = request.body

  request.blog.likes = body.likes

  logger.info(request.blog)

  request.blog.save()

  response.json(request.blog)
})

module.exports = blogRouter