const express = require('express')
const router = express.Router()

var multer = require('multer');

const verifyToken = require("../middlewares/authJwt");

const {user_post ,
       get_post ,
        comment ,
          like, 
          unlike,
          uncomment,
          remove,
         listByUser,
         listNewsFeed,
         postByID } = require('../controllers/post.controller')

const { userByID } =require('../controllers/user.controller')

// router.route('/')


var storage = multer.diskStorage({
  destination: function (req,file,cb){
      cb(null, 'public/photos')
  }
})
var upload = multer({storage: storage}); 

// .get('/api/posts/upload', get_post )
router.get('/api/posts/feed/:userId', listNewsFeed )
      .post('/api/posts/upload/:userId', upload.single('photo'),  function(req, res){
          user_post(req,res)
        })

router.put('/api/posts/like',like)
router.put('/api/posts/unlike',unlike)

router.put('/api/posts/comment',comment)
router.put('/api/posts/uncomment',uncomment)
router.get('/api/posts/by/:userId',listByUser)

router.delete('/api/posts/:postId',remove)


// router.put('/api/posts/like', postCtrl.like)

router.param('userId', userByID)
router.param('postId', postByID)


module.exports = router