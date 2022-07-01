const mongoose = require('mongoose')

if (process.argv.length < 3){
  console.log('please provide password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@cluster0.exzlm.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  phone: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  mongoose.connect(url).then(() => {
    console.log('connected, and we wanna add new person')

    const person = new Person({
      name: process.argv[3],
      phone: process.argv[4]
    })

    return person.save()
  })
    .then(() => {
      console.log('person save')
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else if (process.argv.length === 3) {
  mongoose.connect(url).then(() => {
    console.log('connected, and let\'s see persons below')
    Person.find({})
      .then(persons => {
        persons.map(person => {
          console.log(`${person.name} ${person.phone}`)})
        mongoose.connection.close()
      })
  })
}

