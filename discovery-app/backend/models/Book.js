const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: {type: String, rquired: true},
    description: {type: String, rquired: true},
    coverImage: {type: String, rquired: true},
    author: {type: String, rquired: true},
    genre: {type: String, rquired: true},
    bookContent: {type: String, rquired: true},
    yearOfPublication: {type: String, rquired: true},
})

module.exports = mongoose.model('Book', BookSchema);