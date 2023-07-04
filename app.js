const express = require('express')
require('express-async-errors')

const app = express()

const cors = require('cors')
const { errorHandler, tokenExtractor } = require('./utils/middleware')

const { blogRouter, loginRouter, userRouter, authorRouter, readinglistsRouter } = require('./controllers')


app.use(cors())
app.use(express.json())

app.use(tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readinglistsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)


module.exports = app