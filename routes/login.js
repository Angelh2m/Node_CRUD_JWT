const express = require("express");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const SEED = require('../config/config').SEED;

const app = express();

// Import the articles as mongoose schema
const User = require("../models/user");



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