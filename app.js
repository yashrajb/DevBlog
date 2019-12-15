const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
//routes
const authRoutes = require("./routes/auth-routes");
const postRoutes = require("./routes/post-route");
const commentRoutes = require("./routes/comment-route");
const myProfileRoutes = require("./routes/my-profile");

const passport = require("passport");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
var session = require("express-session");

//models
const { User } = require("./models/users");
const { Post } = require("./models/post");

//middlewares
const {
  authenticationHome,
  checkAuthentication
} = require("./config/middleware");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["123456789"]
  })
);

app.use(
  session({
    secret: "123456789qwertyuiop",
    cookie: { maxAge: 60000 },
    resave: false, // forces the session to be saved back to the store
    saveUninitialized: false // dont save unmodified
  })
);
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.use("/post", postRoutes);
app.use("/auth", authRoutes);
app.use("/comment", commentRoutes);
app.use("/my-profile", myProfileRoutes);

app.get("/", authenticationHome, async (req, res) => {
  var total = await Post.find({}).countDocuments();
  var pagesize = 5;
  var skip = 0;
  if (req.query.page && req.query.page !== "1") {
    pagesize = parseInt(req.query.page) - 1;
    skip = pagesize * (total - 1);
  }
  var posts = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "by"
      }
    },
    {
      $project: {
        title: "$title",
        content: {
          $substr: ["$content", 0, 100]
        },
        slug: "$slug"
      }
    },
    {
      $skip: skip
    },
    {
      $limit: pagesize
    }
  ]);

  res.render("index", { user: req.user, posts: posts, total: total });
});

app.get("/api/search/:word", (req, res) => {
  var pattern = new RegExp(`^${req.params.word}`, "ig");
  Post.find({ title: { $regex: pattern } }).then(result => {
    res.send(result);
  });
});

app.get("/profile/:username", async (req, res) => {
  if (req.user && req.params.username === req.user.username) {
    res.redirect("/my-profile/");
  }
  var profile = await User.aggregate([
    {
      $match: { username: req.params.username }
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "author",
        as: "posts"
      }
    }
  ]);
  profile[0].posts.forEach(obj => {
    obj.content = obj.content.slice(0, 300);
  });
  res.render("profile", { user: req.user, profile: profile });
});

app.get("/dashboard", checkAuthentication, (req, res) => {
  Post.aggregate([
    {
      $match: { author: req.user._id }
    },
    {
      $project: {
        title: "$title",
        content: {
          $substr: ["$content", 0, 100]
        },
        slug: "$slug"
      }
    }
  ]).then(result => {
    result.forEach(obj => {
      obj.content = obj.content.replace(/(\<br \/>)/gi, " ");
    });
    res.render("dashboard", { user: req.user, posts: result });
  });
});

app.get("/isLoggedIn", (req, res) => {
  var result = req.user ? true : false;
  res.json({
    loggedin: result
  });
});

app.listen(port, () => {
  console.log(`server is started at ${port} port`);
});
