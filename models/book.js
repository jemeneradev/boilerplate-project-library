const mongoose = require('mongoose')

module.exports = mongoose.model('Book', {
    title: {
        type: String,
        required: true,
        unique: true
    },
    commentcount:{
        type: Number,
        min: 0,
        default:0
    }
})