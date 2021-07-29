/*
“the data received from client-side shouldn’t be blindly trusted.”
 */
const { validationResult } = require('express-validator')

const jwt = require('jsonwebtoken');


const nodemailer = require('nodemailer');

const _ = require('lodash');

const { OAuth2Client } = require('google-auth-library');

const { errorHandler } = require('../helpers/dbErrorHandling');



const User = require('../models/user.model')



exports.registerController = (req,res) => {
    const { name , email , password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        const firstError = errors.array().map(error => error.msg)[0];
        // 422 Unprocessable Entity:The request was well-formed but was unable to be followed due to semantic errors.
        return res.status(422).json({
            errors : firstError
        })
    } else{
        User.findOne({
            email
        }).exec((err,user) => {    //Executes the query , callback(error, result)
            if (user){
                return res.status(400).json({
                    errors: 'Email is taken'
                })
            }
        });

        // const user = new User({
        //   name,
        //   email,
        //   password
        // })

        // user.save((err, user) => {
        //   if (err) {
        //     console.log('Save error', errorHandler(err));
        //     return res.status(401).json({
        //       errors: errorHandler(err)
        //     });
        //   } else {
        //     return res.json({
        //       success: true,
        //       message: user,
        //       message: 'Signup success'
        //     });
        //   }
        // });

        /* 
        jwt.sign(payload, secretOrPrivateKey, [options, callback])

        */
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

  exports.signinController = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({
        errors: firstError
      });
    } else {
      // check if user exist
      User.findOne({
        email
      }).exec((err, user) => {
        if (err || !user) {
          return res.status(400).json({
            errors: 'User with that email does not exist. Please signup'
          });
        }
        // authenticate User using User Model Method
        if (!user.authenticate(password)) {
          return res.status(400).json({
            errors: 'Email and password do not match'
          });
        }
        // generate a token and send to client
        const token = jwt.sign(
          {
            _id: user._id
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '7d'
          }
        );
        const { _id, name, email, role } = user;
  
        return res.json({
          token,
          user: {
            _id,
            name,
            email,
            role
          }
        });
      });
    }
  };

  exports.forgotPasswordController = (req, res) => {
    const { email } = req.body;
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({
        errors: firstError
      });
    } else {
      User.findOne({ email }, (err, user) => {   //Here we use callback insted of .exec()
          if (err || !user) {
            return res.status(400).json({
              error: 'User with that email does not exist'
            });
          }
          console.log(user)
          const token = jwt.sign(
            {
              _id: user._id
            },
            process.env.JWT_RESET_PASSWORD,
            {
              expiresIn: '10m'
            }
          );

          var emailData = {
            from: process.env.YOUR_GMAIL_ADDRESS,
            to: email,
            subject: `Password Reset link`,
            // text: req.body.message,
            html: `
                      <h1>Please use the following link to reset your password</h1>
                      <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
                      <hr />
                      <p>This email may contain sensetive information</p>
                      <p>${process.env.CLIENT_URL}</p>
                  `
        };

          var auth = {
            type: 'oauth2',
            user: process.env.YOUR_GMAIL_ADDRESS,
            clientId: process.env.YOUR_CLIENT_ID,
            clientSecret: process.env.YOUR_CLIENT_SECRET,
            refreshToken: process.env.YOUR_REFRESH_TOKEN,
        };
  
          return user.updateOne( { resetPasswordLink: token }, (err, success) => {
              if (err) {
                console.log('RESET PASSWORD LINK ERROR', err);
                return res.status(400).json({
                  error:
                    'Database connection error on user password forgot request'
                });
              } else {

              var transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: auth,
              });
          
              transporter.sendMail(emailData, (err, res) => {
                  if (err) {
                      console.log(err);
                      return res.json({
                        message: err.message
                      });
                  } else {
                      console.log(JSON.stringify(res));
                      return res.json({
                        message: `Email has been sent to ${email}. Follow the instruction to reset password of your account`
                      });
                  }
              });

              }
            }
          );
        }
      );
    }
  };
  
  exports.resetPasswordController = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;
    console.log(resetPasswordLink, newPassword);
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const firstError = errors.array().map(error => error.msg)[0];
      return res.status(422).json({
        errors: firstError
      });
    } else {
      if (resetPasswordLink) {
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(
          err,
          decodedupdatedFields
        ) {
          if (err) {
            return res.status(400).json({
              error: 'Expired link. Try again'
            });
          }

          User.findOne(
            {
              resetPasswordLink
            },
            (err, user) => {
              if (err || !user) {
                return res.status(400).json({
                  error: 'Something went wrong. Try later'
                });
              }
  
              const updatedFields = {
                password: newPassword,
                resetPasswordLink: ''
              };
              // console.log('Updated User',user.updateOne({ _id : user._id},updatedFields))
              //  _.extend return an object containing property field from both Fields
              user = _.extend(user, updatedFields);  
              user.save((err, result) => {
                if (err) {
                  return res.status(400).json({
                    error: 'Error resetting user password'
                  });
                }
                res.json({
                  message: `Great! Now you can login with your new password`
                });
              });
            }
          );
        });
      }
    }
  };


  const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
// Google Login
exports.googleController = (req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken( { idToken, audience: process.env.GOOGLE_CLIENT } )
    .then(response => {
      // console.log('GOOGLE LOGIN RESPONSE',response)
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
              expiresIn: '7d'
            });
            const { _id, email, name, role } = user;
            return res.json({
              token,
              user: { _id, email, name, role }
            });
          } else {
            let password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                return res.status(400).json({
                  error: 'User signup failed with google'
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
              );
              const { _id, email, name, role } = data;
              return res.json({
                token,
                user: { _id, email, name, role }
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: 'Google login failed. Try again'
        });
      }
    });
};

// exports.signout = (req, res) => {
//   res.clearCookie("t")
//   return res.status('200').json({
//     message: "signed out"
//   })
// }

// exports.requireSignin = expressJwt({
//   secret: config.jwtSecret,
//   userProperty: 'auth'
// })

// exports.hasAuthorization = (req, res, next) => {
//   const authorized = req.profile && req.auth && req.profile._id == req.auth._id
//   if (!(authorized)) {
//     return res.status('401').json({
//       error: "User is not authorized"
//     })
//   }
//   next()
// }
