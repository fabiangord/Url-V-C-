const Url = require('../models/url')
const { nanoid } = require("nanoid");

const leerUrl = async (req,res)=>{

    try {
        const urls = await Url.find({user: req.user.id}).lean()
        res.render('home', {urls})
    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/')
    } 
}

const agregarUrl = async (req, res)=>{

    const {origin} = req.body
    const shortURL = nanoid(7)

    try {
        const url = new Url({origin, shortURL, user: req.user.id})
        await url.save()
        req.flash('mensaje', [{msg: 'Url agregada'}])
        res.redirect('/')
    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/')
    }
}

const eliminarUrl = async(req,res)=>{

    const {id} = req.params

    try {

        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)){
            throw new Error('No es tu URL cerdo')
        }else{
            await url.remove()
            req.flash('mensaje', [{msg: 'Url eliminada'}])
        }
        res.redirect('/')
        
    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/')
    }
}

const editarUrlForm = async(req,res)=>{
    
    const {id} = req.params

    try {

        const url = await Url.findById(id).lean()

        if(!url.user.equals(req.user.id)){
            throw new Error('No es tu URL cerdo')
        }

        res.render('home', {url})
        
    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/')
    }
}

const editarUrl = async(req,res)=>{

    const {id} = req.params
    const {origin} = req.body

    try {

        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)){
            throw new Error('No es tu URL cerdo')
        }else{
            await url.updateOne({origin})
            req.flash('mensaje', [{msg: 'URL editada'}])
        }
        res.redirect('/')
        
    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/')
    }
}

const redireccionar = async (req, res) => {
    const { shortURL } = req.params;
    try {
        const url = await Url.findOne({ shortURL });
        return res.redirect(url.origin);
    } catch (error) {
        req.flash('mensaje', [{msg: 'No existe el direccionamiento'}])
        return res.redirect('/auth/login')
    }
};

module.exports = {
    leerUrl,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl, 
    redireccionar
}