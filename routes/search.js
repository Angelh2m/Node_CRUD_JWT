const express = require("express");
const app = express();
const Article = require("../models/article");

// ==================================================
//       Search all the Articles 
// ==================================================

app.get("/all/:term", (req, res) => {

    let search = req.params.term;
    let regex = new RegExp(search, 'i');
    
    searchArticles(regex)
        .then(articles => {
            res.status(200).json({
                ok: true,
                articles: articles
            });
        });

});


function searchArticles(regex) {
    
    return new Promise((resolve, reject) => {
        
        Article.find({ 'name': regex }, (err, articles) => {
           
            if (err) {
                reject('Error loading the Article');
            } else {
                // Send the data
                resolve(articles);
            }
            
        });
    });
}

// ==================================================
//       Search by friendly URL 
// ==================================================


app.get("/:category/:term", (req, res) => {

    const category = req.params.category;
    const search = req.params.term;
    const regex = new RegExp(search, 'i'); 


    Article.find({ 'url': search }, (err, articles) => {
        res.status(200).json({
            ok: true,
            articles: articles
        });
    }); 


});





// Export the route
module.exports = app;
