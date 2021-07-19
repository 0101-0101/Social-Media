const express = require('express')
const router = express.Router()

const {list ,addFollowing, addFollower} =require('../controllers/user.controller')

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
router.put('/api/users/follow', addFollowing, addFollower)

// router.put('/api/users/unfollow',removeFollowing, removeFollower)


module.exports = router
