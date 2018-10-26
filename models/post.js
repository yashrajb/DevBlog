const mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
	author:{
		type:mongoose.Schema.Types.ObjectId,
		required:true
	},
	title:String,
	content:String,
	slug:String
});


var Post = mongoose.model("post",postSchema);

module.exports = {
	Post
};