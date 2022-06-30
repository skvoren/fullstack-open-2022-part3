require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

morgan.token('post-data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :post-data'))

const PORT = process.env.PORT

const countOfPersons = () => {
    return Person.count
}

const getDate = () => {
    const timeElapsed = Date.now()
    return new Date(timeElapsed)
}

const infoData = {
    countOfPersons: `phonebook has info for ${countOfPersons()}`,
    Date: getDate()
}

const isPersonExist = (name, phone) => {
    return Person.find({name: name, phone: phone}).count() === 1
}

app.get('/api/persons', (_request, response) => {
    Person.find({}).then(result => {
        response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person){
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => errorHandler(error, request, response, next))
})

app.get('/api/info', (_request, response) => {
    response.json(infoData)
})

app.post('/api/create-person', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.phone){
        response.status(400).json({
            error: "empty body of request!"
        })
    } else if (isPersonExist(body.name, body.phone)){
        response.status(400).json({
            error: "person added already"
        })
    } else {
        const person = new Person({
            name: body.name,
            phone: body.phone,
        })

        person.save()
            .then(result => response.json(result))
            .catch(error => errorHandler(error, request, response, next))
    }
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        phone: body.phone
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {response.json(updatedPerson)})
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }  else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


