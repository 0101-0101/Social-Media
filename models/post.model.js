const mongoose = require('mongoose')
const crypto = require('crypto')


const postSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    photo:{
        type:String
    },
    likes : [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    comments: [{
        text:String,
        created : { type: Date , default: Date.now },
        postedBy: { type: mongoose.Schema.ObjectId ,ref: 'User'}
    }],
    postedBy:{ type: mongoose.Schema.ObjectId, ref:'User'},
    created:{
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Post',postSchema);