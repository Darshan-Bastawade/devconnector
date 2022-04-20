const express = require ('express');
const router =express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

//Load validation

const validatProfileInput = require('../../validation/profile')
const validatExperinceInput = require('../../validation/experice')
const validatEducationInput = require('../../validation/education')
//Load profile model
const Profile = require('../../models/Profile');

// Load user model
const User = require('../../models/Users');
const profile = require('../../validation/profile');
// @route GET api/profiles/test  created for profiles route
router.get('/test', (req,res) => res.json({msg: "Profile works"}));

// @route GET api/profiles/  get cuurent users profile Acceess is private
router.get('/' , passport.authenticate ('jwt', { session:false}), (req,res) =>{
    const errors = {};
    Profile.findOne({user : req.user.id})
    .populate('user',['name','avatar'])
        .then( profile =>{
            if(!profile)
            {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
            
        })
        .catch (err => res.status(404).json(err));
});

// @route GET api/profiles/handle/:handle  get profile by handle  Acceess is public

router.get('/handle/:handle', (req,res) => {
    const errors = {};

    Profile.findOne({handle : req.params.handle})
        .populate('user', ['name','avatar'])
            .then(profile => {
            if(!profile)
            {
                errors.noprofile = 'There is no profile for this error';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err)); 
});


// @route GET api/profiles/user/:user_id  get profile by user id  Acceess is public

router.get('/user/:user_id', (req,res) => {
    Profile.findOne({user:req.params.user_id})
        .populate('user', ['name','avatar'])
        .then(profile => {
            if(!profile)
            {
                errors.noprofile = 'There is no profile for this error';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json({profile : 'There is no profile for this user'})); 
});

// @route GET api/profiles/user/  get All profiles Acceess is public
router.get('/all' , (req,res) => {
    const errors = {};
    Profile.find()
    .populate('user', ['name','avatar'])
    .then(profiles => {
        if(!profiles)
        {
            errors.noprofile = 'There are no profiles';
            res.status(404).json(errors);
        }
        res.json(profiles);
    })
    .catch(err => res.status(404).json({profiles : 'There are no profiles'}));
});


// @route POST api/profiles/  creating user profile or edit user profile Acceess is private
router.post('/' ,
 passport.authenticate ('jwt', { session:false}), 
 (req,res) =>{
    const {errors,isValid} = validatProfileInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }

       
        //get Fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.location) profileFields.location = req.body.location; 
        if (req.body.website) profileFields.website = req.body.website; 
        if (req.body.status) profileFields.status = req.body.status; 
        if (req.body.bio) profileFields.bio = req.body.bio; 
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        // Skills split into array
        if (typeof(req.body.skills) != 'undefined')
        {
            profileFields.skills = req.body.skills.split(',');
        }

        //social
        profileFields.social = {};

        if (req.body.youtube) profileFields.social.youtube = req.body.youtube; 
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter; 
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram; 
        if (req.body.facebook) profileFields.social.facebookfacebook = req.body.facebook; 
        if (req.body.linkdin) profileFields.social.linkdin = req.body.linkdin;
        // ***** user : req.user.id this is act like id and used for logged in user
        
        Profile.findOne({user : req.user.id})
           
            .then(profile => {
                if(profile)
                {
                    // Update
                    Profile.findOneAndUpdate({user : req.user.id},
                         {$set :profileFields},
                         {new :true})
                         .then(profile => res.json(profile));
                }
                else
                {
                    // Create 

                    // Check if handle exists
                    Profile.findOne({handle : profileFields.handle})
                    .then(profile => {
                        if(profile){
                            errors.handle = 'This handle is already exists';
                            res.status(400).json(errors);
                        }

                        // Save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    });
                }
            });
        }
);

// @route POST api/profiles/experince add experince to user   Access is private

router.post('/experince', passport.authenticate('jwt', {session:false}), (req,res) =>{
    const {errors,isValid} = validatExperinceInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }
    
    Profile.findOne({user : req.user.id})
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company : req.body.company,
                location: req.body.location,
                from :req.body.from,
                to : req.body.to,
                current : req.body.current,
                description: req.body.description

            }
            profile.experince.unshift(newExp);

            profile.save().then(profile => res.json(profile));

        })
});
// @route Delete api/profiles/eexperince/:exp_id Delete experince form user   Access is private

router.delete('/experince/:exp_id', passport.authenticate('jwt', {session:false}), (req,res) => {
    Profile.findOne({user : req.user.id})
        .then (profile => {
        //get remove index
        const removeIndex = profile.experince
            .map(item => item.id)
            .indexOf(req.params.exp_id);
        
        // Splice out of array 
        profile.experince.splice(removeIndex,1);

        //Save
        profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});
// @route POST api/profiles/education add education to user   Access is private

router.post('/education', passport.authenticate('jwt', {session:false}), (req,res) => {
    const {errors,isValid} = validatEducationInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }
    Profile.findOne({user : req.user.id})
        .then (profile => {
            const newEdu = {
                school :req.body.school,
                degree :req.body.degree,
                fieldofStudy :req.body.fieldofStudy,
                from :req.body.from,
                to :req.body.to, 
                curret :req.body.curret,
                description :req.body.description

            }
            profile.Education.unshift(newEdu);

            profile.save().then( profile => res.json(profile));
        })
});

// @route Delete api/profiles/education/:edu_id Delete education form user   Access is private
router.delete('/education/:edu_id', passport.authenticate('jwt', {session:false}), (req,res) => {
    Profile.findOne({user : req.user.id})
        .then (profile => {
             //get remove index
        const removeIndex = profile.Education
        .map(item => item.id)
        .indexOf(req.params.edu_id);
    
    // Splice out of array 
    profile.Education.splice(removeIndex,1);

    //Save
    profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
   
});

// @route Delete api/profiles/ Delete profile and user   Access is private
router.delete('/', passport.authenticate('jwt', {session:false}), (req,res) => {
    Profile.findOneAndRemove({user : req.user.id})
        .then (() =>{
            User.findOneAndRemove({ _id: req.user.id})
            .then (() =>{
            res.json({msg : "success"});
            })
        })
       
});
module.exports =router;         