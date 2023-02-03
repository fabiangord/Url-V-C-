const { URL } = require("url")



const urlValidar =(req,res,next)=>{

    try {

        const {origin} = req.body

        const urlfront = new URL(origin)
        
        if(urlfront.origin !== 'null'){
            if(urlfront.protocol === 'http:'||
               urlfront.protocol === 'https:'){
                return next()
            }else{
                throw new Error('La ruta debe tener https://');
            }

        }

        throw new Error('Url no valida');
        
    } catch (error) {
        if(error.message === 'Invalid URL'){
            req.flash('mensaje', [{msg: 'URL invalida'}])
        }else{
            req.flash('mensaje', [{msg: error.message}])

        }
        return res.redirect('/')
    }

}

module.exports = urlValidar