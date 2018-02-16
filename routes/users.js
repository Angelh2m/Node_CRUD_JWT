const express = require("express");
const bcrypt = require('bcryptjs');
// const jwt = require("jsonwebtoken");

const middleWareAuth = require('../middleware/authentication');

const app = express();

// Import the articles as mongoose schema
const User = require('../models/user');



// ==================================================
//       GET users
// ==================================================
app.get("/", middleWareAuth.verifyToken, (req, res) => {

    User.find({}, 'name email img role ')
        .exec((err, users) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error loading the user',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                users: users
            });

        });
});








 


// ==================================================
//       POST-CREATE users 
// ==================================================

app.post('/', (req, res) => {

    // body parser gets the sen't data
    const body = req.body;

    //  Create a reference to the article's Schema
    const user = new User({
        email: body.email,
        name: body.name,
        // Encypt the password
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        google: body.google,
    });


    // Save on the Database
    user.save((err, savedUser) => {

        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    message: 'Error trying to create a user',
                    erors: err
                });
        }

        // 201 Created!
        res.status(201)
            .json({
                ok: true,
                message: 'A new user has been created!',
                user: savedUser,
                // This comes from the middleware
                // Info from the user making the post request
                userToken: req.user
            });

    })
});


// ==================================================
//       PUT-UPDATE users 
// ==================================================


app.put('/:id', middleWareAuth.verifyToken , (req, res) => {

    const id = req.params.id;
    const body = req.body;

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    message: "Error trying to create a user",
                    erors: err
                });
        }

        if (!user) {
            return res
                .status(400)
                .json({
                    ok: false,
                    message: `The user with the id: ${id} does not exist`,
                    erors: { message: 'Does not exist with that ID' }
                });
        }

        // Make the changes to the user
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {

            if (err) {
                return res.status(400)
                    .json({
                        ok: false,
                        message: "Error updating the user",
                        errors: err
                    });
            }

            userSaved.password = ":)";

            res.status(200)
                .json({
                    ok: true,
                    message: "The user has been updated!",
                    body: userSaved
                });

        });

    });
});


// ==================================================
//       Delete User 
// ==================================================


app.delete("/:id", middleWareAuth.verifyToken, (req, res) => {
  
  const id = req.params.id;

  User.findByIdAndRemove(id, (err, deletedUser) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error tyring to delete user",
        errors: err
      });
    }

    if (!deletedUser) {
      return res.status(400).json({
        ok: false,
        message: "Error tyring to delete user with that id",
        errors: {
          message: "Error tyring to delete user with that id"
        }
      });
    }

    res.status(200).json({
      ok: true,
      message: "The user has been deleted!",
      body: deletedUser
    });
  });
});



// Export the route
module.exports = app;