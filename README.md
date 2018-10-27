# DevBlog
Simple multiuser blogging system using node js and mongodb

To Run this application some API keys needed and mongodb database
1.google Oauth API
2.Tinymce editor API

Google Oauth API

1. go to add google API console.
2. add your project and create credentials
3. copy clientID","clientSecret","callbackURL" 
4. paste it to config/keys.js or you can create keys.json file and put it all API keys

Tinymce editor API

1. Login in to Tinymce
2. create API
3. Add that "script" tag into views/edit.js views/write-blg.js

Live - https://floating-everglades-10580.herokuapp.com/
