const express = require('express')
const {response} = require("express");
const app = express()

app.use(express.json())

const PORT = 3001

const persons = [
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

app.get('/api/info', (_request, response) => {
    response.json(infoData)
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})


