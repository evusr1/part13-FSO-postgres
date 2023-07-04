const readinglistsRouter = require('express').Router()
const { UserReading } = require('../models')

readinglistsRouter.post('/', async (request, response) => {
  console.log(request.body)
  const readinglist = await UserReading.create({
    blogId: request.body.blogId,
    userId: request.body.userId
  })

  response.status(201).json(readinglist)
})

module.exports = readinglistsRouter