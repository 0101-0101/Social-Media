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
      const request = new Post(requestBody)
      try{
          await request.save()
          res.status(201).json({photo_path: req.file.path})
      }catch(e){
          console.log("error",e)
          res.status(400).send(e)
      }
  }

  exports.get_post  = async (req,res) =>{
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



