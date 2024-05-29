require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;

mongoose.connect(url)
    .then(result => {
        console.log(`${new Date().toISOString()}: Connected to MongoDB`)
    })
    .catch(error => {
        console.log(`${new Date().toISOString()}: Error during MongoDB connection: ${error.message}`)
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v
    }
});

module.exports = mongoose.model('Person', personSchema);