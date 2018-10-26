function authenticationHome(req,res,next){
	if(req.user){
		return res.redirect("/dashboard");
	}

	return next();
}

function checkAuthentication(req,res,next){
	if(!req.user){
			return res.redirect("/");
	}

	return next();
}

module.exports = {
	authenticationHome,
	checkAuthentication
};
