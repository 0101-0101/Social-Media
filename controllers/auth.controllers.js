const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer');

const { errorHandler } = require('../helpers/dbErrorHandling');



const User = require('../models/auth.model')



exports.registerController = (req,res) => {
    const { name , email , password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0];
        return res.status(422).json({
            errors : firstError
        })
    } else{
        User.findOne({
            email
        }).exec((err,user) => {
            if (user){
                return res.status(400).json({
                    errors: 'Email is taken'
                })
            }
        });

        const token = jwt.sign(
            {
                name,email,password
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn:'30m'
            }
        )

    // var auth = {
    //     type: 'oauth2',
    //     user: 'YOUR_GMAIL_ADDRESS',
    //     clientId: 'YOUR_CLIENT_ID',
    //     clientSecret: 'YOUR_CLIENT_SECRET',
    //     refreshToken: 'YOUR_REFRESH_TOKEN',
    // };
    var auth = {
        type: 'oauth2',
        user: process.env.YOUR_GMAIL_ADDRESS,
        clientId: process.env.YOUR_CLIENT_ID,
        clientSecret: process.env.YOUR_CLIENT_SECRET,
        refreshToken: process.env.YOUR_REFRESH_TOKEN,
    };

    var emailData = {
        from: process.env.YOUR_GMAIL_ADDRESS,
        to: email,
        subject: 'Account activation link',
        // text: req.body.message,
        html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `
    };

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: auth,
    });

    transporter.sendMail(emailData, (err, res) => {
        if (err) {
            return console.log(err);
        } else {
            console.log(JSON.stringify(res));
        }
    });
}
}

exports.activationController = (req, res) => {
    const { token } = req.body;
  
    if (token) {
      jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
        if (err) {
          console.log('Activation error');
          return res.status(401).json({
            errors: 'Expired link. Signup again'
          });
        } else {
          const { name, email, password } = jwt.decode(token);
  
          console.log(name,email,password);
          const user = new User({
            name,
            email,
            password
          });
          console.log("user",user);
  
          user.save((err, user) => {
            if (err) {
              console.log('Save error', errorHandler(err));
              return res.status(401).json({
                errors: errorHandler(err)
              });
            } else {
              return res.json({
                success: true,
                message: user,
                message: 'Signup success'
              });
            }
          });
        }
      });
    } else {
      return res.json({
        message: 'error happening please try again'
      });
    }
  };