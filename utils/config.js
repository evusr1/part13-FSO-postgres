require('dotenv').config()

const DATABASE_URL = process.env.NODE_ENV==='test' ?
  process.env.DATABASE_URL_TEST
  : process.env.DATABASE_URL

const PORT = process.env.PORT

module.exports = {
  DATABASE_URL,
  PORT
}