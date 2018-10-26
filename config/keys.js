
var env = process.env.NODE_ENV || "development";
var clientID,clientSecret,callbackURL;
var fileRequire;
if(env==="development"){

	fileRequire = require("./keys.json");
	clientID = fileRequire["clientID"];
	clientSecret = fileRequire["clientSecret"];
	callbackURL = fileRequire["callbackURL"];

}else {



	clientID = process.env.clientID;
	clientSecret = process.env.clientSecret;
	callbackURL = process.env.callbackURL;


}


module.exports = {
	clientID,
	clientSecret,
	callbackURL 
};