const config = require('./utils/config')
const express = require('./node_modules/express')
const bodyParser = require('./node_modules/body-parser')
const app = express()
const blogsRouter = require('./controllers/blogs')
const eventsRouter = require('./controllers/events')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const cors = require('./node_modules/cors/lib')



console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors()) 
app.use(middleware.requestLogger) 
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/', eventsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
 
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app