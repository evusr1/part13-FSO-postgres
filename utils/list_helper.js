const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blog) => {
  return 1
}

const totalLikes = (blog) => {
  return blog.reduce((sum, blogPost) => {
    return sum + blogPost.likes
  }, 0)
}

const favoriteBlog = (blog) => {
  if(!blog.length)
    return null

  const reducedBlog = blog.reduce((favorite, blogPost) => {
    if(!favorite)
      return blogPost
    if(blogPost.likes > favorite.likes)
      return blogPost

    return favorite
  }, null)

  const returnedBlog = {
    title: reducedBlog.title,
    author: reducedBlog.author,
    likes: reducedBlog.likes
  }

  return returnedBlog
}

const mostBlogs = (blog) => {
  if(!blog.length)
    return null

  const blogAuthor = (blogPost) => blogPost.author

  const authorCount = _(blog).countBy(blogAuthor)
    .toPairs()
    .maxBy(1)

  return {
    'author': authorCount[0],
    'blogs': authorCount[1]
  }
}

const mostLikes = (blog) => {
  if(!blog.length)
    return null

  const blogAuthor = (blogPost) => blogPost.author
  const likesSum = (author) => author.likes

  let authorCount = _(blog).groupBy(blogAuthor)
    .toPairs()
    .map((authorPair) => {
      return [ authorPair[0], _.sumBy(authorPair[1], likesSum) ]
    })
    .maxBy(1)

  return {
    'author': authorCount[0],
    'likes': authorCount[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}