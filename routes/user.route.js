const express = require('express')
const router = express.Router()

var multer = require('multer');


const {list ,addFollowing, addFollower,search,user_pp,
        removeFollowing, removeFollower,
        userByID,read} =require('../controllers/user.controller')

// import userCtrl from '../controllers/user.controller'
// import authCtrl from '../controllers/auth.controller'
// // import authJwt from '../middlewares/authJwt'


// router.route('/')
// .get(userCtrl.list)
// .post(userCtrl.create)

// router.route('/api/users/:userId')
//     .get(authCtrl.requireSignin, userCtrl.read)
//     .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
//     .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

// router.param('userId', userCtrl.userByID)

// module.exports = router

router.get('/api/users',list)


var storage = multer.diskStorage({
        destination: function (req,file,cb){
            cb(null, 'public/user_pp')
        }
      })
var upload = multer({storage: storage}); 

router.put('/api/users/pp/:userId', upload.single('photo'),  function(req, res){
        user_pp(req,res)
        })

router.put('/api/users/follow', addFollowing, addFollower)

router.get('/api/users/:userId',read)

router.post('/api/users/search',search)

router.put('/api/users/unfollow',[removeFollowing, removeFollower])

router.param('userId', userByID)


module.exports = router
