const mongoose = require('mongoose');
const {userRoles} = require('../shared/enums')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    role: {
        type: String,
        enum: userRoles,
        required: true,
    },
})

const User = mongoose.model('user',userSchema);

module.exports = User;