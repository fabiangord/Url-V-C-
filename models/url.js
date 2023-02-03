const mongoose = require('mongoose')
const {Schema} = mongoose

const urlEsquema = new Schema({
    origin:{
        type: String,
        unique: true,
        required: true
    },
    shortURL: {
        type: String,
        unique: true,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Url = mongoose.model('Url', urlEsquema)
module.exports = Url