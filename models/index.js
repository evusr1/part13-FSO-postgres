const Blog = require('./blog')
const User = require('./user')
const UserReading = require('./user_reading')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserReading, as: 'marked_blogs' })
Blog.belongsToMany(Blog, { through: UserReading, as: 'users_marked' })

module.exports = {
  Blog,
  User,
  UserReading
}