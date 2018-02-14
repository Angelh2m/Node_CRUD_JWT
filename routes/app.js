const express = require("express");

let app = express();

// Define the route
app.get("/", (req, res, next) => {
  
    res.status(200).json({
      ok: true,
      message: "The route is correct!"
    });
});

  
// Export the route
module.exports = app;