const User = require('../models/user.model')
// import _ from 'lodash'
// import errorHandler from '../helpers/dbErrorHandling'


/**
 * Load user and append to req.
 */
exports.userByID = (req, res, next, id) => {
  User.findById(id)
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
    if (err || !user) return res.status('400').json({
      error: "User not found"
    })
    req.profile = user
    next()
  })
}

exports.read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

exports.list = (req, res) => {
    // const val= User.find({},{'name':1})
    // const val = User.find({}).select('name')
    const val = User.find({}).select('name profile_pic')
    .populate('following', '_id')
    // const val= users.find({"name":true})

    val.exec(function (err, someValue) {
      if (err) return next(err);
      console.log("values",someValue)
      res.send(someValue);
  });  
    // res.json(val)
}



exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    // next()
  })
}

exports.addFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true})
  .populate('following', '_id name')
  .populate('followers', '_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    // result.hashed_password = undefined
    // result.salt = undefined
    res.json(result)
  })
}


exports.search = (req,res) => {
  console.log(req.query.value);
  const val = req.query.value
  console.log(val);
  return User.find({"name": new RegExp(".*"+val+".*", "i"),}).select('name profile_pic')
  .then((result)=>{
    // console.log("result",result);
      res.status(200).json(result)
    } )
}

exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    next()
  })
}

exports.removeFollower = (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true})
  .populate('following', '_id name')
  .populate('followers', '_id name')
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  })
}

exports.user_pp =  (req, res) => {
  console.log(req.file); // form files
  console.log(req.params.userId , req.file.path)
  
    // User.findByIdAndUpdate(req.params.userId,{ $set: { "profile_pic": req.file.path} } , (err, result) => {
    /* User.findByIdAndUpdate(req.params.userId, { profile_pic: req.file.path}, (err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
    res.json(result)
    }) */

    // {new: true} return the Updated result
    User.findByIdAndUpdate(req.params.userId, { profile_pic: req.file.path},{new: true})
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
    console.log(result)
    res.json(result)
    })

} 


