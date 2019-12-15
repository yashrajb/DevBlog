const router = require("express").Router();
const { checkAuthentication } = require("../config/middleware");
const { User } = require("../models/users");
const multer = require("multer");
const path = require("path");
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploaded-images");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + req.user.username.replace(" ", "") + Date.now() + ".jpg"
    );
  }
});

var upload = multer({ storage: storage });
const fs = require("fs");

router.get("/", checkAuthentication, (req, res) => {
  res.render("myprofile", { user: req.user });
});

router.post(
  "/upload/picture",
  checkAuthentication,
  upload.single("pic"),
  async function(req, res, next) {
    if (
      req.file.mimetype === "image/jpeg" ||
      req.file.mimetype === "image/png"
    ) {
      if (req.user.profile_pic !== "dummy.jpg") {
        fs.unlink(
          path.join(
            __dirname,
            "..",
            "public",
            "uploaded-images",
            req.user.profile_pic
          ),
          function(err) {
            if (err) {
              req.flash("Error", "Something happened wrong");
              return res.redirect("/dashboard");
            }
          }
        );
      }
      User.updateOne(
        { _id: req.user._id },
        { $set: { profile_pic: req.file.filename } }
      )
        .then(result => {
          if (!result) {
            return Promise.reject();
          }
          return res.redirect("/my-profile");
        })
        .catch(err => {
          req.flash("Error", "Something happened wrong");
          return res.redirect("/dashboard");
        });
    } else {
      fs.unlink(
        path.join(__dirname, "..", "public", "uploaded-images"),
        function(err) {
          req.flash("Error", "pls upload images");
          return res.redirect("/my-profile/");
        }
      );
    }
  }
);

router.post("/add/bio", checkAuthentication, (req, res) => {
  if (!req.body.bio) {
    req.flash("error", "Pls fill the input");
    return res.redirect("/my-profile/");
  }
  var Bio = req.body.bio;
  User.updateOne({ _id: req.user._id }, { $set: { Bio } })
    .then(result => {
      if (!result) {
        Promise.reject();
      }
      res.redirect("/my-profile/");
    })
    .catch(err => {
      req.flash("error", "Something happened wrong");
      res.redirect("/my-profile/");
    });
});

module.exports = router;
