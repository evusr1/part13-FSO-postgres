const Blog = require('./blog')
const User = require('./user')
const Session = require('./session')
const UserReading = require('./user_reading')

User.hasMany(Blog)
Blog.belongsTo(User)
Session.belongsTo(User)


User.belongsToMany(Blog, { through: UserReading, as: 'readings' })
Blog.belongsToMany(User, { through: UserReading, as: 'users_marked' })

module.exports = {
  Blog,
  User,
  Session,
  UserReading
}