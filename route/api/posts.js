const express = require ('express');
const router =express.Router();
const mongoose=require('mongoose');
const passport= require('passport');


//Load validation

const validatPostInput = require('../../validation/post')

const Post= require('../../models/Post');
const Profile= require('../../models/Profile');

// @route GET api/posts/test  created for test route
router.get('/test', (req,res) => res.json({msg: "Post works"}));

// @route GET api/posts/ Getting post Access is public
router.get('/',(req,res) =>{
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.json({msg : "No posts found"}));
});

// @route GET api/posts/:id Getting post Access is public
router.get('/:id',(req,res) =>{
    Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.json({msg : "No post found"}));
        
});
// @route POST api/posts Create post Access is private

router.post('/',passport.authenticate('jwt', {session:false}),(req,res) =>{
    const {errors,isValid} = validatPostInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }
    const newPost = new Post({
        text :req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user:req.user.id
    });
    newPost.save().then(post => res.json(post));
});

// @route DELETE api/posts/:id Getting post Access is private
router.delete('/:id',passport.authenticate('jwt', {session:false}),(req,res) =>{
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
            .then(post => {
                //Check postowner
                if(post.user.toString() !== req.user.id)
                {
                    return res.status(401).json({notsuthorized : 'User not authorized'});
                }
                //Delete
                post.remove().then(() => res.json({success :true}));
            })
        })
        .catch(err => res.status(404).json({postnotfound:"No post found"}));
});


// @route POST api/posts/like/:id Like post Access is private
router.post('/like/:id',passport.authenticate('jwt', {session:false}),(req,res) =>{
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
            .then(post => {
               if(post.likes.filter(like => like.user.toString() ===req.user.id).length > 0)

               {
                    return res.status(400).json({alreadyliked:"Already liked the post"});

               }
               // Add user id to likes array
               post.likes.unshift({user :req.user.id});
               post.save().then(post => res.json(post))

            })
        })
        .catch(err => res.status(404).json({postnotfound:"No post found"}));
});
// @route POST api/posts/unlike/:id UnLike post Access is private
router.post('/unlike/:id',passport.authenticate('jwt', {session:false}),(req,res) =>{
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
            .then(post => {
               if(post.likes.filter(like => like.user.toString() ===req.user.id).length === 0)

               {
                    return res.status(400).json({alreadyliked:"You have not yet liked the post"});

               }
               // Get the remove index
               const removeIndex = post.likes 
                 .map(item => item.user.toString())
                 .indexOf(req.user.id);

                //Splice out of an array
                post.likes.splice(removeIndex,1);

                //save
                post.save().then(post => res.json(post))


            })
        })
        .catch(err => res.status(404).json({postnotfound:"No post found"}));
});
// @route POST api/posts/comment/:id Comment post Access is private
router.post('/comment/:id',passport.authenticate('jwt', {session:false}),(req,res) =>{
    const {errors,isValid} = validatPostInput(req.body);
    if(!isValid)
    {
        return res.status(400).json(errors);
    }
   
    Profile.findOne({user:req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
            .then(post => {
              
               const newComment= {
                   text:req.body.text,
                   name:req.body.name,
                   avatar: req.body.avatar,
                   user:req.user.id
               }
               // Add user id to likes array
               post.comments.unshift(newComment);
               post.save().then(post => res.json(post));

            })
        })
        .catch(err => res.status(404).json({postnotfound:"No post found"}));
});
// @route Delete api/posts/comment/:id/:comment_id Remove comment from post Access is private
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt', {session:false}),(req,res) =>{

            Post.findById(req.params.id)
            .then(post => {
              if (post.comments.filter(comment => comment._id.toString()===req.params.comment_id).length === 0)
              {
                  return res.json(404).json({ commentnotexist:"Comment does not exist"});
              }
            // Get the remove index
            const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);

           //Splice out of an array
           post.comments.splice(removeIndex,1);

           //save
           post.save().then(post => res.json(post))
            })
        
        .catch(err => res.status(404).json({postnotfound:"No post found"}));
});

module.exports =router;