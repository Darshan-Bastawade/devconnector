const express = require ('express');
const router =express.Router();
// @route GET api/profiles/test  created for profiles route
router.get('/test', (req,res) => res.json({msg: "Profile worls"}));

module.exports =router;