const express = require('express')
const { loginForm, registerForm, registerUser, cuentaConfirmada, loginUser, cerrarSesion } = require('../controllers/authController')
const router = express.Router()
const {body} = require('express-validator')


router.get('/register', registerForm)
router.post('/register',[
    body('nombre', 'Ingrese nombre valido')
        .trim()
        .notEmpty()
        .escape(),
    body('email', 'Ingrese email valido')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Contraseña minimo de 6 caracteres')
        .trim()
        .isLength({min: 6})
        .escape()
        .custom((value, {req})=>{
            if(value !== req.body.repassword){
                throw new Error('Las contraseñas no coinciden')
            }else{
                return value
            }
        })

], registerUser)
router.get('/confirmar/:token', cuentaConfirmada)
router.get('/login', loginForm)
router.post('/login',[
    body('email', 'Ingrese email valido')
        .trim()
        .isEmail()
        .normalizeEmail(),
    body('password', 'Contraseña minimo de 6 caracteres')
        .trim()
        .isLength({min: 6})
        .escape()   
], loginUser)
router.get('/logout', cerrarSesion)


module.exports = router