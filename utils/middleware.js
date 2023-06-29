const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if(error.name === 'ValidationError')
    response.status(400).json({ error: error.message })

  if(error.name === 'JsonWebTokenError')
    return response.status(400).json({ error: error.message })

  if(error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if(authorization && authorization.startsWith('Bearer '))
    request.token = authorization.replace('Bearer ', '')

  next()
}

const userExtractor = async (request, response, next) => {
  if(!request.token)
    return response.status(401).json({ error: 'token invalid' })

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken.id)
    return response.status(401).json({ error: 'token invalid' })

  request.user = await User.findByPk(decodedToken.id)
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userExtractor
}