const logoutRouter = require('express').Router()

const { Session } = require('../models')

logoutRouter.delete('/', async (request, response) => {
  await Session.destroy({
    where: {
      sessionToken: request.token
    }
  })

  response.status(204).end()
})

module.exports = logoutRouter