const express = require('express')
const router = express.Router()

// load Controllers
const { registerController,
        activationController
    } = require('../controllers/auth.controllers')


const {
    validSign,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helpers/valid')

router.post('/register', validSign , registerController)

router.post('/activation', activationController)


module.exports = router