const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {type: String, rquired: true, unique: true},
    username: {type: String, rquired: true, unique: true},
    password: {type: String, rquired: true}
})

module.exports = mongoose.model('User', UserSchema);