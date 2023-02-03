const express = require('express')
const { leerUrl, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionar } = require('../controllers/homeController')
const { formPerfil } = require('../controllers/perfilController')
const urlValidar = require('../middlewares/urlValida')
const verificacionUser = require('../middlewares/verificacionUser')
const router = express.Router()





router.get('/', verificacionUser,leerUrl )
router.post('/', verificacionUser,urlValidar, agregarUrl)
router.get('/eliminar/:id', verificacionUser,eliminarUrl)
router.get('/editar/:id',verificacionUser,editarUrlForm)
router.post('/editar/:id',verificacionUser,urlValidar, editarUrl)

router.get('/:shortURL', redireccionar)



module.exports = router