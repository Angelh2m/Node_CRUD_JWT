const express = require("express");
const middleWareAuth = require("../middleware/authentication");

const app = express();

// Import the articles as mongoose schema
const Article = require('../models/article');

// Express Upload
const fileUpload = require('express-fileupload');

// ==================================================
//       Article find
// ==================================================
app.get("/", (req, res) => {

    Article.find({}).sort('name')
        
        .exec((err, articles) => {
        if (err) {            
            return res.status(500).json({
                ok: false,
                message: 'Error loading Article',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            articles: articles
        });

    });
});

// ==================================================
//       Update the article
// ==================================================
app.put("/:id", middleWareAuth.verifyToken, (req, res) => {

    const id = req.params.id; // Grab the ID from the url
    let body = req.body; // Recive the payload

    Article.findById(id, (err, article) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding the Article',
                errors: err
            });
        }

        if (!article) {
            return res.status(400).json({
                ok: false,
                message: 'The article with tat id does not exist',
                errors: {
                    message: 'It does not exist'
                }
            });
        }

        // Update the article from the payload info
        article.name = body.name;
        article.category = body.category;
        article.image = body.image;
        article.date = body.date;
        article.author = body.author;
        article.content = body.content;
        article.labels = body.labels;
        article.comments = body.comments;
        
        article.save((err, articleSaved) => {

          if (err) {  
            return res.status(400)
              .json({
                ok: false,
                message: "Conflict trying to update article",
                errors: err
              });
          }

          res.status(200)
            .json({
              ok: true,
              articleSaved: articleSaved
            });
        });
    });
});


// ==================================================
//       POST Article 
// ==================================================

app.post("/", middleWareAuth.verifyToken, (req, res) => {
  
    const body = req.body; // Recive the payload

  //  Create a reference to the article's Schema
  //----------------------------------------------
  const article = new Article({
    name: body.name,
    category: body.category,
    image: body.image,
    date: body.date,
    // Get the req.user from the middleware
    author: req.user._id,
    content: body.content,
    labels: body.labels,
    comments: body.comments
  });

  // Save on the Database
  article.save((err, articleSaved) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error",
        erors: err
      });
    }

    // 201 Created!
    res.status(201).json({
      ok: true,
      article: articleSaved,
    });
  });
});



// ==================================================
//       Delete Article 
// ==================================================


app.delete("/:id", middleWareAuth.verifyToken, (req, res) => {
  // Grab the ID from the url
  const id = req.params.id;

  Article.findByIdAndRemove(id, (err, eraseArticle) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error trying to erase the Article",
        erors: err
      });
    }

    if (!eraseArticle) {
      return res.status(500).json({
        ok: false,
        message: "That article does not exist",
        erors: {
          message:
            "The article with that ID can't be erased, it might not exist"
        }
      });
    }

    // 200 success
    res.status(200).json({
      ok: true,
      message: "Article erased!"
    });
  });
});



  
// Export the route
module.exports = app;