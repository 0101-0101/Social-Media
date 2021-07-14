const express = require('express')
const router = express.Router()

// load Controllers
const { registerController } = require('../controllers/auth.controllers')

router.post('/register', registerController)

module.exports = router