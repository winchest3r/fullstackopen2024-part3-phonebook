require('dotenv').config({ path: '.env.local' });

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static('dist'));

const morgan = require("morgan");
morgan.token("request-body", (request, response) => {
  return Object.keys(request.body).length ? JSON.stringify(request.body) : "";
});
app.use(
  morgan(
    ":date[iso]: :method :url :status :res[content-length] - :response-time ms :request-body ",
  ),
);

const Person = require('./models/person');
let persons = [];

app.get("/info", (request, response) => {
  const message = `Phonebook has info for ${persons.length} people`;
  response.send(`<p>${message}</p><p>${Date()}</p>`);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end();
  })
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing: bad data content",
    });
  }

  if (persons.find((p) => p.name === body.name)) {
    return response.status(400).json({
      error: "The name already exists in the phonebook: name must be unique",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson)
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`${new Date().toISOString()}: Server running on port ${port}`);
});
