const mongoose = require('mongoose')

module.exports = mongoose.model('Comment', {
   text: {
        type: String,
        required: true,
        unique: true
    },
    book_id:{
        type: mongoose.Types.ObjectId,
        require:true
    }
})