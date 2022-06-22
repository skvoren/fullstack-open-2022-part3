const express = require('express')
const {response, request} = require("express");
const app = express()

app.use(express.json())
app.use(express.urlencoded())

const PORT = 3001

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
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

    if (!body){
        response.status(400).json({
            error: "empty body of request!"
        })
    }

    const newPerson = {
        name: body.name,
        number: body.number,
        id: Date.now()
    }

    persons = persons.concat(newPerson)

    response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)

    response.status(204).end()
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


