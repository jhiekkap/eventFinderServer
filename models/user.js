const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

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
  behavior: [
    {
      favoriteEvents: [
        {
          id: {
            type: String 
          }
        }
      ],
      favoriteTags: [
        {
          name: {
            type: String 
          }
        }
      ],
      visits: [
        {
          loginTime: {
            type: Date 
          },
          logoutTime: {
            type: Date 
          },
          queries: [
            {
              position: Number,
              distance: Number,
              tags: [
                {
                  name: String
                }
              ]
            }
          ],
          addedFavorites: [
            {
              id: String,
              time: Date
            }
          ],
          removedFavorites: [
            {
              id: String,
              time: Date
            }
          ],
          addedTags: [
            {
              name: String,
              time: Date
            }
          ],
          removedTags: [
            {
              name: String,
              time: Date
            }
          ],
          textSearches : [
            {
              word: String,
              time: Date
            }
          ] 
        }
      ]
    }
  ]
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