const mongoose = require('mongoose')
require('dotenv').config({ path: './.env.local' })

if (process.argv.length < 3) {
    console.log('enter your password as an argument')
    process.exit(1)
}

const password = process.argv[2]

// MONGODB_URL variable in .env.local file should contain '${PASSWORD}' placeholder
const url = process.env.MONGODB_URL.replace("${PASSWORD}", password)

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook:')
    Person.find({}).then(res => {
        res.forEach(p => console.log(p.name, p.number))
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const newName = process.argv[3]
    const newNumber = process.argv[4]

    const person = new Person({
        name: newName,
        number: newNumber,
    })
    person.save().then(res => {
        console.log(`added ${newName} with number ${newNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('wrong arguments count')
    mongoose.connection.close()
}