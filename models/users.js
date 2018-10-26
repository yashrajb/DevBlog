const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	username:{
			type:String,
			required:true
	},
	googleId:{
			type:String,
			required:true
	},
	Bio:String,
	profile_pic:String
});

var User = mongoose.model("user",userSchema);

module.exports = {User};