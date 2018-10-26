require("./mongoose-connect");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const cookieSession = require("cookie-session");
const {User} = require("../models/users");
const {clientID,clientSecret,callbackURL} = require("./keys.env.js");
passport.serializeUser((user,done) => {
	done(null,user.id);
});

passport.deserializeUser((id,done) => {
	User.findById(id).then((user) => {
		done(null,user);
	});
})

passport.use(new GoogleStrategy({
	clientID,
	clientSecret,
	callbackURL
},(accessToken,refreshToken,profile,done) => {

		User.findOne({googleId:profile.id}).then((result) => {

			if(result){
				done(null,result);
			}else {
				var user = new User({
						username:profile.displayName,
						googleId:profile.id,
						Bio:"",
						profile_pic:"dummy.jpg"
					});
					user.save().then((result) => {
						done(null,result);
					})
			}
		});
	})
);


