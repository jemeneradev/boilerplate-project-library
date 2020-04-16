const mongoose = require('mongoose')

module.exports = mongoose.model('Book', {
    title: {
        type: String,
        required: true,
        unique: true
    }
})