const blogsRouter = require('../node_modules/express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('../node_modules/jsonwebtoken')


blogsRouter.get('/', async (request, response) => {

    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
        response.json(blogs.map(blog => blog.toJSON()))
    } catch (exception) {
        next(exception)
    }
})


blogsRouter.post('/', async (request, response, next) => {

    const body = request.body

    if (!body.title || !body.url) {
        response.status(400).end()
    }

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    try {
        const user = await User.findById(decodedToken.id)
        console.log('USER: ', user)

        const blog = new Blog({

            url: body.url,
            title: body.title,
            author: body.author,
            user: user,
            likes: body.likes === undefined ? 0 : body.likes
        })
        console.log('BLOG: ', blog)

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        console.log('BLOG SAVED!!')
        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {

    const body = request.body

    const blog =
    {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: body.user.id
    }

    console.log('UPDATED BLOG:', blog)

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    console.log('DECODED TOKEN', decodedToken)
 
    try { 
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog.toJSON())
    } catch (exception) {
        next(exception)
    } 
})

blogsRouter.delete('/:id', async (request, response, next) => {

    const blog = await Blog.findById(request.params.id)

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (blog.user.toString() === decodedToken.id.toString()) {
        try {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        } catch (exception) {
            next(exception)
        }
    } else {
        return response.status(401).json({ error: 'unauthorized deleting attempt' })
    }
})



module.exports = blogsRouter 