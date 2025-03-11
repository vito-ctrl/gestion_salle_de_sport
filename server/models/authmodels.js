const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    fullName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        unique: true,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type: String,
        default: 'user'
    }
})

const User = mongoose.model('login', loginSchema);
module.exports = User;