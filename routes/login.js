const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SEED = require('../config/config').SEED;

const app = express();
// Import the articles as mongoose schema
const User = require("../models/user");

// Google required files
const GoogleAuth = require('google-auth-library');
const auth = new GoogleAuth;

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;



// ==================================================
//       Google Auth 
// ==================================================
app.post('/google', (req, res) => {
  
  const token = req.body.token || 'xxx';
  const client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

  client.verifyIdToken(
    token,
    GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
    function (err, login) {
      
      if (err) {
        return res.status(400)
              .json({
                ok: false,
                message: 'Token not valid',
                errors: err
               }); 
      }

      var payload = login.getPayload();
      var userid = payload['sub'];
      // If request specified a G Suite domain:
      //var domain = payload['hd'];

      res.status(200).json({
        ok: true,
        payload: payload,
      });
      
    });
});












// ==================================================
//       Authentication 
// ==================================================

app.post('/', (req, res) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
    
        if (err) {
            return res.status(500)
              .json({
                ok: false,
                message: "Error tyring to find user",
                errors: err
              });    
        }

        if (!userDB) {

            return res.status(400)
              .json({
                ok: false,
                message: "Incorrect - email",
                errors: err
              });
        }

        // Authenticate the using using their password
        if (!bcrypt.compareSync(body.password, userDB.password)) {

             return res.status(400)
               .json({
                 ok: false,
                 message: "Incorrect - password",
                 errors: err
               });
        }

        // If everything is good, user receives token for 6 hours
        const token = jwt.sign({ user: userDB }, SEED, {expiresIn: 21600 });

        // Hide the password
        userDB.password = ':)';

        res.status(200).json({
            ok: true,
            token: token,
            user: userDB,
            id: userDB._id,
        });

    });
})





module.exports = app;