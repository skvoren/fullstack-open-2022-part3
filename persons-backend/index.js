const express = require('express')
const morgan = require('morgan')
const fs = require("fs")
const path = require("path")
const cors = require("cors")
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

morgan.token('post-data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :post-data'))



const PORT = 3001

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "phone": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "phone": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "phone": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "phone": "39-23-6423122"
    }
]

const countOfPersons = () => {
    return persons.length;
}

const getDate = () => {
    const timeElapsed = Date.now()
    return new Date(timeElapsed)
}

const infoData = {
    countOfPersons: `phonebook has info for ${countOfPersons()}`,
    Date: getDate()
}

app.get('/api/persons', (_request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personData = persons.find(person => person.id === id)

    if (personData) {
        response.json(personData)
    }
})

app.get('/api/info', (_request, response) => {
    response.json(infoData)
})

app.post('/api/create-person', (request, response) => {

    const body = request.body

    if (!body.name || !body.phone){
        response.status(400).json({
            error: "empty body of request!"
        })
    } else if (persons.find(p => p.name === body.name || p.phone === body.phone)){
        response.status(400).json({
            error: "person added already"
        })
    } else {
        const newPerson = {
            name: body.name,
            phone: body.phone,
            id: Date.now()
        }

        persons = persons.concat(newPerson)

        response.json(persons)
    }





})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)

    response.status(204).end()
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


