require('dotenv').config({ path: '.env.local' });

const express = require("express");
const app = express();

app.use(express.static('dist'));
app.use(express.json());

const morgan = require("morgan");
morgan.token("request-body", (request, _response) => {
  return Object.keys(request.body).length ? JSON.stringify(request.body) : "";
});
app.use(
  morgan(
    ":date[iso]: :method :url :status :res[content-length] - :response-time ms :request-body ",
  ),
);

const Person = require('./models/person');

app.get("/info", (request, response, next) => {
  Person.find({})
    .then(persons => {
      const message = `Phonebook has info for ${persons.length} people`;
      response.send(`<p>${message}</p><p>${Date()}</p>`);
    })
    .catch(error => next(error));
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons);
    })
    .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(_result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "The name or number is missing: bad data content",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(`${new Date().toISOString()}: ERROR - ${error.message}`);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  }

  next(error);
}

app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`${new Date().toISOString()}: Server running on port ${port}`);
});
