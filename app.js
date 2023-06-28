const express = require('express')
require('express-async-errors')

const app = express()

const cors = require('cors')
const { errorHandler } = require('./utils/middleware')

const blogRouter = require('./controllers/blog')
//const userRouter = require('./controllers/user')
//const loginRouter = require('./controllers/login')


app.use(cors())
app.use(express.json())

//app.use(tokenExtractor)

app.use('/api/blogs', blogRouter)
//app.use('/api/users', userRouter)
//app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)


module.exports = app