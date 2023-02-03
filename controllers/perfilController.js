
const formidable = require('formidable')
const fs = require('fs')
const Jimp = require('jimp')
const path = require('path')
const User = require("../models/User")


const formPerfil = async(req, res)=>{

    try {
        const user = await User.findById(req.user.id)
        res.render('perfil', {user:req.user, image: user.image})
    } catch (error) {
        req.flash('mensaje', [{msg: 'Error al leer el usuario'}])
    }
}

const editarFotoPerfil = async(req,res)=>{
    const form = new formidable.IncomingForm()
    form.maxFileSize = 50 * 1024 * 1024

    form.parse(req, async(error, fields, files)=>{
        try {

            if(error){
                throw new Error('falló formidable')
            }


            console.log(fields)


            const file = files.myFile

            if(file.originalFilename === ''){
                throw new Error('Por favor inserte una imagen')
            }


            const imageTypes = ['image/jpeg', 'image/png' ]

            if(!imageTypes.includes(file.mimetype)){
                throw new Error('Por favor inserte un formato de imagen valido... (jpeg o png)')
            }
            

            if(file.size > 50 * 1024 * 1024){
                throw new Error('La imagen excede el tamaño adecuado... (menos de 5MB)')
            }

            const extension = file.mimetype.split('/')[1]
            const dirFile = path.join(__dirname, `../public/img/perfil/${req.user.id}.${extension}`)
            
            fs.renameSync(file.filepath, dirFile)

            const imagen =  await Jimp.read(dirFile)
            imagen.resize(200,200).quality(90).writeAsync(dirFile)



            const user = await User.findById(req.user.id)
            user.image = `${req.user.id}.${extension}`
            await user.save()


            req.flash('mensaje', [{msg: 'Se subió la imagen'}])
    
            
        } catch (error) {
            req.flash('mensaje', [{msg: error.message}])
        } finally {
            return res.redirect('/perfil/edit')
        }
    })
}

module.exports = {
    formPerfil,
    editarFotoPerfil
}