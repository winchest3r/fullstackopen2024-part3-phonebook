const mongoose = require('mongoose');
require('dotenv').config({ path: './.env.local' });

const url = process.env.MONGODB_URL;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 4) {
    const newName = process.argv[3];
    const newNumber = process.argv[4];

    const person = new Person({
        name: newName,
        number: newNumber,
    });
    person.save().then(res => {
        console.log(`added ${newName} with number ${newNumber} to phonebook`)
        mongoose.connection.close()
    });
} else {
    console.log('phonebook:');
    Person.find({}).then(res => {
        res.forEach(p => console.log(p.name, p.number))
        mongoose.connection.close()
    });
}