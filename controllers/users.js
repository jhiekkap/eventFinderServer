const bcrypt = require('../node_modules/bcrypt/bcrypt')
const usersRouter = require('../node_modules/express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {

  const users = await User.find({})

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
      favorites: body.favorites
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})


usersRouter.put('/', async (request, response, next) => {

  const body = request.body

  
  const oldUser = await User.findOne({ username: body.username })

  console.log('OLD USER', oldUser)

  /* const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash) */

    let updatedUser = {
      name: oldUser.name,
      username: oldUser.username,
      password: oldUser.passwordHash,
      favorites: body.favorites,
    }


   
  console.log('UPDATED USER:', updatedUser)

  /* const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
  } */

  //console.log('DECODED TOKEN', decodedToken)

  try { 
      const responseUser = await User.findByIdAndUpdate(oldUser.id, updatedUser, { new: true })
      response.json(responseUser.toJSON())
  } catch (exception) {
      next(exception)
  } 
})


module.exports = usersRouter