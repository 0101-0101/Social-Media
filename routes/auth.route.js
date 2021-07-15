const express = require('express')
const router = express.Router()

// load Controllers
const { registerController,
        activationController,
        signinController,
        forgotPasswordController,
        resetPasswordController,
        googleController
    } = require('../controllers/auth.controllers')


const {
    validSign,
    validLogin,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../helpers/valid')

router.post('/register', validSign , registerController)

router.post('/activation', activationController)

router.post('/login',validLogin, signinController)

router.put('/forgotpassword', forgotPasswordValidator, forgotPasswordController);
router.put('/resetpassword', resetPasswordValidator, resetPasswordController);

router.post('/googlelogin', googleController)


module.exports = router