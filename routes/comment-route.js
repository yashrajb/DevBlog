const router = require("express").Router();
const {checkAuthentication} = require("../config/middleware");
const {User} = require("../models/users");
const {Post} = require("../models/post");
const {Comment} = require("../models/comment");

 router.post("/add/:slug",checkAuthentication,async (req,res) => {
 	var slug = req.params.slug;
 	var post = await Post.findOne({slug});
 	var newComment = await new Comment({
 		post_id:post._id,
 		name:req.user.username,
 		comment:req.body.comment
 	}).save();
 	res.send(newComment);
 });

 module.exports = router;