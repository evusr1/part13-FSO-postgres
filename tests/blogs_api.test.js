const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')


describe('no login', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))

    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  describe('listing blog posts in correct format', () => {
    test('all blogs are returned as json with correct length', async () => {
      const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(helper.initialBlogs.length)
    }, 100000)


    test('id is defined', async () => {
      const response = await api.get('/api/blogs')

      response.body.forEach(blog => expect(blog.id).toBeDefined())
    }, 100000)
  })

  describe('update blog post', () => {
    test('update a blog post likes', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogsToUpdate = { ...blogsAtStart[0], likes: blogsAtStart[0].likes + 1 }

      const response = await api
        .put(`/api/blogs/${blogsToUpdate.id}`)
        .send(blogsToUpdate)
        .expect('Content-Type', /application\/json/)

      expect(response.body.likes).toBe(blogsToUpdate.likes)
    }, 100000)
  })

  describe('deletion of blog post', () => {
    test('no token delete a single blog post failure', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogsToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogsToDelete.id}`)
        .expect(401)

    }, 100000)
  })
  describe('adding a blog posts', () => {
    test('no user, a invalid blog cannot be added', async () => {
      const newBlogWithoutUser = { ...helper.newBlog }
      delete newBlogWithoutUser.user

      await api
        .post('/api/blogs')
        .send(newBlogWithoutUser)
        .expect(401)
    }, 100000)
  })
})

describe('with login', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    const user = new User({
      username: helper.rootUser.username,
      name: helper.rootUser.name,
      passwordHash
    })

    await user.save()

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog({ ...blog, user: user._id }))

    const promiseArray = blogObjects.map(blog => blog.save())

    await Promise.all(promiseArray)
  })

  describe('adding a blog posts', () => {
    test('a valid blog can be added', async () => {
      const user = { ...helper.rootUser }
      delete user.name

      const responseLogin = await api
        .post('/api/login')
        .send(user)

      const newBlogWithoutUser = { ...helper.newBlog }
      delete newBlogWithoutUser.user

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlogWithoutUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const responseBlogs = await api.get('/api/blogs')

      expect(responseBlogs.body).toHaveLength(helper.initialBlogs.length + 1)

      const contentObjects = helper.sanitizeBlogs(responseBlogs)

      expect(contentObjects).toContainEqual(helper.newBlog)
    }, 100000)

    test('likes are stripped when adding', async () => {
      const user = { ...helper.rootUser }
      delete user.name

      const responseLogin = await api
        .post('/api/login')
        .send(user)

      const newBlogWithLikesNoUser = { ...helper.newBlog, likes: 10 }
      delete newBlogWithLikesNoUser.user

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlogWithLikesNoUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const responseBlogs = await api.get('/api/blogs')

      const contentObjects = helper.sanitizeBlogs(responseBlogs)

      expect(contentObjects).toContainEqual(helper.newBlog)
    }, 100000)

    test('an invalid blog without url cannot be added', async () => {
      const user = { ...helper.rootUser }
      delete user.name

      const responseLogin = await api
        .post('/api/login')
        .send(user)

      const newBlogWithNoUserURL = { ...helper.newBlog }
      delete newBlogWithNoUserURL.user
      delete newBlogWithNoUserURL.url

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlogWithNoUserURL)
        .expect(400)
    }, 100000)

    test('an invalid blog without title cannot be added', async () => {
      const user = { ...helper.rootUser }
      delete user.name

      const responseLogin = await api
        .post('/api/login')
        .send(user)

      const newBlogWithNoUserTitle = { ...helper.newBlog }
      delete newBlogWithNoUserTitle.user
      delete newBlogWithNoUserTitle.title

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlogWithNoUserTitle)
        .expect(400)
    }, 100000)
  })

  describe('deletion of blog post', () => {
    test('delete a single blog post', async () => {
      const user = { ...helper.rootUser }
      delete user.name

      const responseLogin = await api
        .post('/api/login')
        .send(user)

      const blogsAtStart = await helper.blogsInDb()
      const blogsToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogsToDelete.id}`)
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

      expect(blogsAtEnd).not.toContainEqual(blogsToDelete)
    }, 100000)

    test('non owner cannot delete a single blog post', async () => {
      const passwordHash = await bcrypt.hash(helper.newUser.password, 10)
      const user = new User({ username: helper.newUser.username, passwordHash })

      await user.save()

      const responseLogin = await api
        .post('/api/login')
        .send(helper.newUser)

      const blogsAtStart = await helper.blogsInDb()
      const blogsToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogsToDelete.id}`)
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .expect(401)
    }, 100000)
  })
})


/*test('update a blog post author', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogsToUpdate = {...blogsAtStart[0], author: "changed author"}

    const response = await api
                        .put(`/api/blogs/${blogsToUpdate.id}`)
                        .send(blogsToUpdate)
                        .expect('Content-Type', /application\/json/)

    expect(response.body.author).toBe(blogsToUpdate.author)

}, 100000)

test('update a blog post title', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogsToUpdate = {...blogsAtStart[0], title: "changed title"}

    const response = await api
                        .put(`/api/blogs/${blogsToUpdate.id}`)
                        .send(blogsToUpdate)
                        .expect('Content-Type', /application\/json/)

    expect(response.body.title).toBe(blogsToUpdate.title)

}, 100000)

test('update a blog post url', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogsToUpdate = {...blogsAtStart[0], url: "changed url"}

    const response = await api
                        .put(`/api/blogs/${blogsToUpdate.id}`)
                        .send(blogsToUpdate)
                        .expect('Content-Type', /application\/json/)

    expect(response.body.url).toBe(blogsToUpdate.url)

}, 100000)*/

afterAll(async () => {
  await mongoose.connection.close()
})