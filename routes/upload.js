const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require('fs');

const Article = require('../models/article')

// default options
app.use(fileUpload());

// Define the route
app.put("/:type/:id", (req, res) => {

    const type = req.params.type;
    const id = req.params.id;



    if (!req.files) {
      return res.status(400)
        .json({
          ok: false,
          message: "Error uploading the file",
          errors: {message: 'An image needs to be selected'}
        });
    }

    let archive = req.files.image;
    const archiveName = archive.name.split('.');
    const extension = archiveName[archiveName.length - 1];

    const extensionsAllowed = ['png', 'jpeg', 'jpg', 'gif', 'png'];

    if (extensionsAllowed.indexOf(extension) < 0) {
        return res.status(400)
          .json({
            ok: false,
            message: "Extension no valid",
            errors: { message: "Extension no valid " + extensionsAllowed.join(',') }
          });
    }


    // let renamedArchive = `${id}-${new Date().getUTCMilliseconds()}.${extension}`;
    // Move the file to the path
    let renamedArchive = `${archive.name}`;
    
    // Move the file to the path

    const path = `./uploads/${type}/${renamedArchive}`;

    // Check if the directory exist
    const dir = `./uploads/${type}`;

    if (!fs.existsSync(dir)) {
        fs.mkdir(dir);
    }


    archive.mv( path, (err) => {
      
        if (err) {
            return res
            .status(500)
            .json({
                ok: false,
                message: "Error moving the file",
                errors: err
            });
        }

        // uploadByType(type, id, name, res);


        res.status(200)
            .json({
            ok: true,
            message: "The route is correct!",
            archive: archive.name
            });
        
        
    });

});


function uploadByType(type, id, name, res) {

    if (type === 'article') {
        
        Article.findById(id, (err, article) => {
            let oldPAth ='./'
        });
    }
    
}

    

// Export the route
module.exports = app;