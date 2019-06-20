const mongoose = require('mongoose')
const uniqueValidator = require('../node_modules/mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    unique: true
  },
  favorites:   [] 
})

userSchema.plugin(uniqueValidator)


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // suodatetaan passwordHash eli salasanan tiiviste pois näkyviltä
    delete returnedObject.passwordHash
  }
})


module.exports = mongoose.model('User', userSchema)