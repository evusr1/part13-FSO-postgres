
const testingRouter = require('express').Router()
const { Blog, User } = require('../models')

testingRouter.post('/reset', async (request, response) => {
  await Blog.destroy({
    where: {},
    truncate: true
  })
  await User.destroy({
    where: {},
    truncate: true
  })

  response.status(204).end()
})

module.exports = testingRouter