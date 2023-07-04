const authorRouter = require('express').Router()
const { sequelize } = require('../utils/db')
const { Blog } = require('../models')

authorRouter.get('/', async (request, response) => {
  const authors = await Blog.findAll({
    group: 'author',
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'articles'],//does not work with NULL author
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ]
  })

  response.json(authors)
})

module.exports = authorRouter