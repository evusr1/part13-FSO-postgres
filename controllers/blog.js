const blogRouter = require('express').Router()

const Blog = require('../models/blog')
//const logger = require('../utils/logger')

//const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll()
    //.populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/',/* userExtractor,*/ async (request, response) => {
  //const user = request.user

  const blog = await Blog.create({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url
    //user: user._id
  })

  /*user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()*/

  response.status(201).json(blog)
})

blogRouter.delete('/:id', /*userExtractor,*/ async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if(!blog)
    return response.status(404).end()

  /*const user = request.user

  if(blog.user.toString() !== user.id.toString())
    return response.status(401).json({ error: 'token invalid' })

  user.blogs = user.blogs.filter(blogUser => blog.id !== blogUser.id)
  await user.save()*/

  await blog.destroy()

  response.status(204).end()
})

/*blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  logger.info(blog)
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true, context: 'query' })

  response.json(updatedBlog)
})*/

module.exports = blogRouter