const express = require('express')
const router = express.Router()

var multer = require('multer');

const verifyToken = require("../middlewares/authJwt");

const {user_post , get_post , comment , like} = require('../controllers/post.controller')

// router.route('/')


var storage = multer.diskStorage({
  destination: function (req,file,cb){
      cb(null, 'public/photos')
  }
})
var upload = multer({storage: storage}); 

router.get('/api/posts/upload', get_post )
      .post('/api/posts/upload', upload.single('photo'),  function(req, res){
          user_post(req,res)
        })

router.put('/api/posts/like',like)
router.put('/api/posts/comment',comment)


// router.put('/api/posts/like', postCtrl.like)
module.exports = router