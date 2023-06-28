const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')
const { connectToDatabase } = require('./utils/db')

const start = async () => {
  await connectToDatabase()
  app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
  })
}

start()