const mongoose = require('mongoose')
const {Schema} = mongoose
const byscript = require('bcryptjs')


const userEsquema = new Schema({
    nombre:{
        type: String,
        required: true,
        lowercase: true
    }, 
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        index: {unique: true}
    },
    password:{
        type: String,
        required: true
    },
    tokenConfirm:{
        type: String,
        default: null
    },
    cuentaConfirm: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        default: null
    }

})

userEsquema.pre('save', async function (next){
    const user = this
    if(!user.isModified('password')) return next()

    try {
        const salt = await byscript.genSalt(10)
        const hash = await byscript.hash(user.password, salt)
        

        user.password = hash

        next()
    } catch (error) {
        console.log(error)
        throw new Error('error al codificar contraseña')
    }
})

userEsquema.methods.comparePassword = async function(candidatePassword){
    return await byscript.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userEsquema)



module.exports = User