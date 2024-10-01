const mongoose = require("mongoose");

const User = mongoose.model('User', {
    name: String,
    password: String,
    documentNumber: String,
    image_profile: String,
})

module.exports = User;