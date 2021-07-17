const express = require('express')
const router = express.Router()

var multer = require('multer');

const verifyToken = require("../middlewares/authJwt");

const {user_post , get_post} = require('../controllers/post.controller')

// router.route('/')


var storage = multer.diskStorage({
  destination: function (req,file,cb){
      cb(null, 'public/photos')
  }
})
var upload = multer({storage: storage}); 

router.get('/upload', get_post )
      .post('/upload', upload.single('photo'),  function(req, res){
          user_post(req,res)
        })

module.exports = router