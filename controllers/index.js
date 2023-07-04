const blogRouter = require('./blog')
const userRouter = require('./user')
const loginRouter = require('./login')
const authorRouter = require('./author')
const readinglistsRouter = require('./readinglists')

module.exports = {
  blogRouter,
  userRouter,
  loginRouter,
  authorRouter,
  readinglistsRouter
}