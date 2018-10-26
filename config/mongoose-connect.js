const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/BlogApp",() => {
	console.log("mongodb is connected");
});

