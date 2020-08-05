const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String
})

module.exports = mongoose.model('user', userSchema, 'Users')