 const Post = require('../models/post.model')

 exports.user_post = async (req, res) => {
    console.log(req.body); // form fields
    console.log(req.file); // form files
    console.log(req.body.title,req.file.path);
      const requestBody = {
          text: req.body.title,
    //       price : req.body.price,
    //       info: req.body.info,
        photo: req.file.path
      }
      const post = new Post(requestBody)
      
      post.postedBy= req.profile
      
      try{
          const { _id } = await post.save()
          console.log("_id:",_id);
          res.status(201).json({ _id,photo_path: req.file.path})
          // res.status(201).json({ _id:post._id, photo_path: req.file.path})

      }catch(e){
          console.log("error",e)
          res.status(400).send(e)
      }
  } 


exports.remove = (req, res) => {
  let post = req.post
    post.remove((err, deletedPost) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(deletedPost)
    })
}
  

  exports.get_post  = async (req,res) => {
    try{
        let prod = await Post.find()
        // console.log("Product",prod);
        res.status(200).json({
            status: 200,
            data: prod
        });
    }catch(err){
        res.status(400).json({
            status:400,
            message:err.message,
        })
}
}

exports.listNewsFeed = (req, res) => {
  let following = req.profile.following
  following.push(req.profile._id)
  Post.find({postedBy: { $in : req.profile.following } })
  .populate('comments', 'text created')
  .populate('comments.postedBy', '_id name')
  .populate('postedBy', '_id name')
  .sort('-created')
  .exec((err, posts) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(posts)
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

exports.comment = (req, res) => {
    console.log("res",req.body);

    let comment =   {}
    comment.text =req.body.comment
    comment.postedBy = req.body.userId
    console.log(comment,comment.postedBy);
    Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(result)
    })
  }

exports.uncomment = (req, res) => {
    // let comment = req.body.comment_id
    // console.log(req.body);
    Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: {_id: req.body.comment_id}}}, {new: true})
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
        if (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
        }
        res.json(result)
    })
}
  
exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(result)
    })
  }
  
exports.unlike = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
  .exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(result)
  })
}

exports.postByID = (req, res, next, id) => {
  Post.findById(id).populate('postedBy', '_id name').exec((err, post) => {
    if (err || !post)
      return res.status('400').json({
        error: "Post not found"
      })
    req.post = post
    next()
  })
}

exports.listByUser = (req, res) => {
  // User.findById(id)
  //   .populate('following', '_id name')
  //   .populate('followers', '_id name')
  //   .exec((err, user) => {
  //   if (err || !user) return res.status('400').json({
  //     error: "User not found"
  //   })

    Post.find({postedBy: req.profile._id})
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(posts)
    })
  }
  // }


