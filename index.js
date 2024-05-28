const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')

morgan.token('request-body', (request, response) => {
    return Object.keys(request.body).length ? JSON.stringify(request.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

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

app.get('/info', (request, response) => {
    const message = `Phonebook has info for ${persons.length} people`
    response.send(`<p>${message}</p><p>${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const limit = 1_000_000_000
    let result = Math.round(Math.random() * limit)
    while (persons.find(p => p.id === result)) {
        result = Math.round(Math.random() * limit)
    }
    return result
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'The name or number is missing: bad data content'
        })
    }
    
    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'The name already exists in the phonebook: name must be unique'
        })
    }
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    
    persons = persons.concat(person)
    
    response.json(person)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})