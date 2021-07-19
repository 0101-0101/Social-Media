const mongoose = require('mongoose')
const crypto = require('crypto')


const userSchema = new mongoose.Schema(
    {
    email: {
        type:String,
        trim: true,
        required : true,
        unique:true,
        lowercase:true
    },
    name:{
        type:String,
        trim: true,
        required : true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt : String,

    role: {
        type: String,
        default: 'Normal'
    },
    resetPasswordLink:{
        data: String,
        default: ''
    },
    photo:{
        type : String
    },
    following: [{type: mongoose.Schema.ObjectId, ref: 'User'}],
    followers: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
},
    {
        timestamps: true
    }
);

userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    })

userSchema.methods = {
    authenticate : function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword : function(password){
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1',this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function() {
        // return Math.round(new Date().valueOf() * Math.round()) + '';
        return crypto.randomBytes(128).toString('base64')
    }
}

module.exports = mongoose.model('User',userSchema);