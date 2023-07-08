const blogRouter = require('./blog')
const userRouter = require('./user')
const loginRouter = require('./login')
const authorRouter = require('./author')
const readinglistsRouter = require('./readinglists')
const logoutRouter = require('./logout')

module.exports = {
  blogRouter,
  userRouter,
  loginRouter,
  authorRouter,
  readinglistsRouter,
  logoutRouter
}