const mongoose = require('mongoose')

module.exports = mongoose.model('Comment', {
   text: {
        type: String,
        required: true,
        unique: true
    },
    bookId:{
        type: mongoose.Types.ObjectId,
        require:true
    }
})