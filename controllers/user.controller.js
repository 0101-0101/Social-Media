const User = require('../models/user.model')
// import _ from 'lodash'
// import errorHandler from '../helpers/dbErrorHandling'


/**
 * Load user and append to req.
 */
exports.userByID = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  })
}

exports.list = (req, res) => {
    // const val= User.find({},{'name':1})
    const val = User.find({}).select('name')
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
    next()
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
    result.hashed_password = undefined
    result.salt = undefined
    res.json(result)
  })
}

const removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}, (err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    next()
  })
}
const removeFollower = (req, res) => {
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



