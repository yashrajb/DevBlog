const mongoose = require("mongoose");

var database_uri = process.env.DATABASE_URI || "mongodb://localhost:27017/BlogApp"

mongoose.connect(database_uri,() => {
	console.log("mongodb is connected");
});

