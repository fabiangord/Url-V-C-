const express = require('express')
const { formPerfil, editarFotoPerfil } = require('../controllers/perfilController')
const verificacionUser = require('../middlewares/verificacionUser')
const router = express.Router()

router.get('/edit',verificacionUser, formPerfil)
router.post('/edit',verificacionUser, editarFotoPerfil)

module.exports = router