const User = require("../models/User")
const {nanoid} = require('nanoid')
const {validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
require('dotenv').config()


const registerForm = (req,res)=>{
    res.render('register')
}

const registerUser = async(req,res)=>{

    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensaje', errors.array())
        return res.redirect('/auth/register')
    }

    const {nombre, email, password} = req.body
    const tokenConfirm = nanoid()

    try {
        let user = await User.findOne({email})

        if(user){
            throw new Error('Ya existe el usuario')
        }

        user = new User({nombre, email, password, tokenConfirm})
        await user.save()

        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS
            }
          });

        await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', 
            to: user.email,
            subject: "Verifica tu cuenta de correo",
            html: `<a href='${ PATHCLEVER || 'http://localhost:8080' }auth/confirmar/${user.tokenConfirm}'>Verifica tu cuenta aquí</a>`
          });

       
        req.flash('mensaje', [{msg: 'Verifica tu correo electronico'}])

        res.redirect('/auth/login')
        

    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/auth/register')
    }
}

const cuentaConfirmada = async(req,res)=>{
    const  {token} = req.params

    try {

        const user  = await User.findOne({tokenConfirm : token})
        if(!user){
            throw new Error('No existe el usuario')
        }

        user.cuentaConfirm = true
        user.tokenConfirm = null

        await user.save()

        req.flash('mensaje', [{msg: 'Cuenta verificada, ya puedes iniciar sesion'}])


        res.redirect('/auth/login')
        
    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/auth/login')
    }
}


const loginForm = (req,res)=>{
    res.render('login')
}

const loginUser = async (req,res)=>{

    
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensaje', errors.array())
        return res.redirect('/auth/login')
    }

    const {email,password} = req.body

    try {
        const user = await User.findOne({email})
        if(!user){
            throw new Error('Usuario o contraseña invalidos')
        }

        if(!user.cuentaConfirm){
            throw new Error('La cuenta no está confirmada, por favor verifica tu correo electronico')
        }

        if(!await user.comparePassword(password)){
            throw new Error('Usuario o contraseña invalidos')
        }

        req.login(user, function(error){
            if(error){
                throw new Error('Error al crear la session')
            }else{
                return res.redirect('/')
            }
        })

     
    } catch (error) {
        req.flash('mensaje', [{msg: error.message}])
        return res.redirect('/auth/login')
    }   
}

const cerrarSesion = async(req,res)=>{
        req.logout(req.user, (err) => {
          if(err){
            return next(err);
          }else{
            res.redirect("/");
          } 
        });
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    cuentaConfirmada,
    loginUser,
    cerrarSesion
}