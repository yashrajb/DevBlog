const mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	post_id:mongoose.Schema.Types.ObjectId,
	name:String,
	comment:String
});

var Comment = mongoose.model("comment",commentSchema);

module.exports = { Comment };