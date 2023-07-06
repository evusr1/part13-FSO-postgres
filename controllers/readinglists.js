const readinglistsRouter = require('express').Router()
const { UserReading } = require('../models')
const { userExtractor } = require('../utils/middleware')

readinglistsRouter.post('/', async (request, response) => {
  console.log(request.body)
  const readinglist = await UserReading.create({
    blogId: request.body.blogId,
    userId: request.body.userId
  })

  response.status(201).json(readinglist)
})


readinglistsRouter.post('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if(!user)
    return response.status(401).json({ error: 'invalid user' })

  const readingListEntry = await UserReading.findOne({
    where: {
      blogId: request.params.id,
      userId: user.id
    }
  })

  readingListEntry.isRead = request.body.isRead
  readingListEntry.save()

  response.json({ isRead: readingListEntry.isRead  })
})
module.exports = readinglistsRouter