const mongoose = require('mongoose')
require('dotenv').config()


mongoose.set('strictQuery', true);
const clientDB = mongoose
    .connect(process.env.URL) 
    .then((m)=>{
        console.log('Base conectada🔥')
        return m.connection.getClient()
    })
    .catch((e)=>{
        console.log('Error')
    })


module.exports = clientDB