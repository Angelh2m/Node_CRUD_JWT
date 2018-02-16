const express = require("express");
const app = express();
const fs = require('fs');

// Define the route
app.get("/:type/:img", (req, res) => {
  
  const type = req.params.type;
  const img = req.params.img;

  let path = `./uploads/${ type }/${ img }`;

  fs.exists(path, exist => {
    
    if (!exist) {
      path = './assets/no-img.jpg';
    }

    res.sendfile(path);


  });
  
  
  
  
  
  // res.status(200).json({
  //   ok: true,
  //   message: "The route is correct!"
  // });
});

// Export the route
module.exports = app;
