const express = require('express');

const router = express.Router();
const gravtar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys');
const passport = require('passport');

// Load input validation

const validatRegisterInput = require('../../validation/register');
const validatLoginInput = require('../../validation/login');

//Load user model
const User = require('../../models/Users');
// @route GET api/users/test  created for test route
router.get('/test', (req, res) => res.json({ msg: "User works" }));
// @route POST api/users/resgiter  created for registration route
router.post('/register', (req, res) => {

    const {errors,isValid} = validatRegisterInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email already exists' });
            }
            else {

                const avatar = gravtar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //Rating
                    d: 'mm'  //default
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (_err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err)
                            throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));

                    })
                })
            }
        })
});

// @route POST api/users/login  created for login route
router.post('/login', (req, res) => {

    const {errors,isValid} = validatLoginInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //Find user by mail
    User.findOne({ email })
        .then(user => {
            // Check for users
            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }

            //Check password the password is in the form of hash so we need to use bcrypt again
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched

                        const payload = { id : user.id, name:user.name, avtar: user.avatar} // create jwt payload


                        // sign token

                        jwt.sign(payload,keys.secretOrKey, {expiresIn: 3600}, (err,token) => {
                            res.json(
                                {
                                    success:true,
                                    token: 'Bearer' + token
                                }
                            );
                        });
                    }
                    else {
                        return res.status(400).json({ password: 'Password Incorrect' });
                    }
                })

        });
});

// @route GET api/users/current return current user

router.get('/current', passport.authenticate('jwt', {session:false}), (req,res) => {
    res.json({
        id : req.user.id,
        name : req.user.name,
        email : req.user.email
    });
});

module.exports = router;

