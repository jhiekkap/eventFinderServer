const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


const initialBlogs = [
  {
    title: 'Ploki',
    author: 'Timo',
    url: 'http://timosoini.fi/',
    likes: 2
  },
  {
    title: 'blogi',
    author: 'Paavo',
    url: 'https://www.paavovayrynen.fi/category/blogi/',
    likes: 99
  },
]

beforeEach(async () => { 
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})


test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(initialBlogs.length)
})


test('returned blogs are identified by id', async () => { 
  const response = await api.get('/api/blogs')
  const firstBlogId = response.body[0].id

  expect(firstBlogId).toBeDefined()
})


test('a valid blog can be added', async () => { 
  const newBlog = {
    title: 'loki',
    author: 'Seppo',
    url: 'http://seppokaariainen.com/blogi/',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs') 
  const titles = response.body.map(r => r.title)

  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(titles).toContain('loki')
})

test('a blog can be added without likes, and default likes = 0 will be saved ', async () => {

  const newBlog = {
    title: 'floki',
    author: 'Teppo',
    url: 'http://teppo.com/blogi/'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs') 
  const tLikes = response.body.find(r => r.title === 'floki').likes

  expect(response.body.length).toBe(initialBlogs.length + 1)
  expect(tLikes).toEqual(0)
})

test('a blog POST request without title or url will get 400 Bad Request', async () => {

  const newBlog = {
    title: 'floki',
    likes: 1000
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('it is possible to delete a single blog ', async () => {

  const response = await api.get('/api/blogs')
  const id = response.body[0].id

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  await api
    .get(`/api/blogs/${id}`)
    .expect(404)
})

test('it is possible to update a single blog ', async () => {
  const response = await api.get('/api/blogs')
  const id = response.body[0].id

  const updatedBlog = {
    title: 'Ploki',
    author: 'Timo',
    url: 'http://timosoini.fi/',
    likes: 3
  }

  await api
    .put(`/api/blogs/${id}`)
    .send(updatedBlog)
    .expect(200)

  const responssi = await api.get('/api/blogs') 
  expect(responssi.body[0].likes ).toEqual(3) 
})

  
afterAll(() => {
  mongoose.connection.close()
})