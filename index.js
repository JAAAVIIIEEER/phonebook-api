const express = require('express')
const app = express()
// Morgan is a logger with different options and formats
const logger = require('morgan')
const cors = require('cors')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
// Cors = Cross Origin Resource Sharing
app.use(cors())

// Create customize token to show the request content
logger.token('reqContent', function (req, res) { return JSON.stringify(req.body) })

// Create logger with that format and adding the customize token
app.use(logger(':method :url :status :req[content-length] - :response-time ms :reqContent'))
app.use(express.json())

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const date = new Date()
  const html = `
    <html>
      <body>
        <p>Phonebook has info for ${persons.length} people</h1>
        <p>${date}</p>
      </body>
    </html>
  `
  response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
  const personId = Number(request.params.id)

  const person = persons.find((person) => person.id === personId)

  if (!person) {
    response.status(404).json({
      status: '404',
      message: 'Entry not found'
    })
  } else {
    response.json(person)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const personId = Number(request.params.id)

  persons = persons.filter((person) => person.id !== personId)

  if (persons.find((person) => person.id === personId)) {
    persons = persons.filter((person) => person.id !== personId)
    response.json(persons)
  } else {
    response.status(204).json({
      status: '204',
      message: 'Entry not found'
    })
  }
})

app.post('/api/persons', (request, response) => {
  const noteBody = request.body

  if (noteBody.name === undefined) {
    response.status(400).json({
      status: '404',
      message: 'not name'
    })
  } else if (noteBody.number === undefined) {
    response.status(400).json({
      status: '400',
      message: 'not number'
    })
  } else {
    if (persons.find((person) => person.name.toLowerCase() === noteBody.name.toLowerCase())) {
      response.status(400).json({
        status: '400',
        message: 'name must be unique'
      })
    } else {
      persons = persons.concat({
        id: Math.floor(Math.random() * 10000),
        name: noteBody.name,
        number: noteBody.number
      })

      response.json(persons)
    }
  }
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found'
  })
})
