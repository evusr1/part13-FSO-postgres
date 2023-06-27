require('dotenv').config()

const postgresURL = process.env.DATABASE_URL

const PORT = process.env.PORT

module.exports = {
  postgresURL,
  PORT
}