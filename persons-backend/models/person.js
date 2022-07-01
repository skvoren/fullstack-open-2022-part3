const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error when connection to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        if (value === undefined) return true
        return /(^\d{3}|^\d{2})-\d*/.test(value)
      },
      message: 'Please enter a valid phone Number'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})



module.exports = mongoose.model('Person', personSchema)
