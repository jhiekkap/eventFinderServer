const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {

  const users = await User.find({}).populate('blogs')

  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response, next) => {
 

  const body = request.body

  if (!body.username) {
    return response.status(401).json({ error: 'username missing ' }).end()
  } else if (body.username.length < 3) {
    return response.status(401).json({ error: 'username too short (min 3 characters)' }).end()
  } else if (!body.password) {
    return response.status(401).json({ error: 'password missing' }).end()
  } else if (body.password.length < 3) {
    return response.status(401).json({ error: 'password too short (min 3 characters)' }).end()
  }

  try {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter