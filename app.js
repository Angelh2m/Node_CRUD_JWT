// ==================================================
//       Require all dependencies 
// ==================================================
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// ==================================================
//       Start the variables 
// ==================================================
let app = express();

// Enable Cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next(); 
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// ==================================================
//       Import the Routes 
// ==================================================
const appRoutes = require('./routes/app');
const appArticles = require('./routes/articles');
const appUsers = require('./routes/users');
const loginRoute = require('./routes/login');
const searchRoute = require("./routes/search");
const uploadRoute = require("./routes/upload");
const imageRoute = require("./routes/img");


 
// Connect to Mongoose
mongoose.connection.openUri(
  "mongodb://localhost:27017/angelHamBlog",

  (err, res)  => {
    if (err) throw err;

    console.log("Mongo is : \x1b[32m%s\x1b[0m", "Online");
  }
);



// Define all the routes
app.use('/articles', appArticles);
app.use('/users', appUsers);
app.use('/login', loginRoute);
app.use('/search', searchRoute);
app.use('/upload', uploadRoute);
app.use("/img", imageRoute);
app.use('/', appRoutes);




// Launch the server
app.listen(3000, (req, err) => {
  console.log("Express server port 3000 : \x1b[32m%s\x1b[0m", "Online");
});
