const {checkAuthentication} = require("../config/middleware");
const {User} = require("../models/users");
const {Post} = require("../models/post");
const {Comment} = require("../models/comment");
const router = require("express").Router();

router.get("/:slug",async (req,res) => {
	var post = await Post.findOne({slug:req.params.slug});
	var comments = await Comment.find({post_id:post._id});
	var story = Post.aggregate([
		{
			$match:{"author":post.author,"_id":post._id}
		},
		{
			$lookup:{
				from:"users",
				localField:"author",
				foreignField:"_id",
				as:"by"
			}
		}
	]).then((result) => {

		if(!result){

			return Promise.reject();

		}
		res.render("read",{user:req.user,story:result,comments});

	}).catch(() => {
		req.flash("Error","Something happened wrong");
		return res.redirect("/write");
	});
});


router.get("/delete/:slug",checkAuthentication,async (req,res) => {
	var slug = req.params.slug;
	var post = await Post.findOne({author:req.user._id,slug});
	Comment.deleteMany({post_id:post._id});
	var deletedPost = await Post.deleteMany({_id:post._id,author:req.user._id,slug});
	res.redirect("/dashboard");
});

router.get("/edit/:slug",checkAuthentication,async (req,res) => {
	var slug = req.params.slug;
	var story = await Post.findOne({author:req.user._id,slug});
	if(!story){
		res.redirect("/dashboard");
	}
	res.render("edit",{user:req.user,story});
});

router.post("/edit/:slug",checkAuthentication,async (req,res) => {
	
	var slug = req.params.slug;
	var update = {title:req.body.title,content:req.body.content};
	var updatedPost = await Post.updateOne({author:req.user._id,slug},update,{});
	if(updatedPost){
		return res.redirect(`/post/${slug}`);
	}

	return res.redirect("/dashboard");

});

router.post("/add",checkAuthentication,(req,res) => {

	if(!req.body.title || !req.body.content){

		if(req.body.title.length < 10){

			req.flash("Error","Title should be more than 10");
			return res.redirect("/write");

		}else if(req.body.content.length < 500){
			req.flash("Error","Content should be more than 4000");
			return res.redirect("/write");
		}

		req.flash("Error","Fill all the inputs");
		return res.redirect("/write");

	}
	var slug = req.body.title;
	slug = slug.toLowerCase();
	slug = slug.replace(/\s+$/,"");
	slug = slug.split(" ").join("-");
	var post = new Post({
		author:req.user.id,
		title:req.body.title,
		content:req.body.content,
		slug
	});
	post.save().then((result) => {
		if(!result){
			req.flash("Notification","Something happened wrong");
		}
		res.redirect("/dashboard");
	});
});

module.exports = router;