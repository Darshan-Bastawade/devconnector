const express = require ('express');
const router =express.Router();
// @route GET api/posts/test  created for post route
router.get('/test', (req,res) => res.json({msg: "Post worls"}));

module.exports =router;