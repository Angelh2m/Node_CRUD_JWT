// Required imports
const jwt = require("jsonwebtoken");
const SEED = require("../config/config").SEED;



// ==================================================
//       Middleware
// ==================================================

exports.verifyToken = (req, res, next) => {
   
    const token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
        // 401 Unauthorized!
        return res.status(401)
            .json({
            ok: false,
            message: "Token not valid!",
            errors: err
            });
        }
        
        // Save the user as req.user for future use
        req.user = decoded.user;

        decoded.user.password = ":)";

        // If everyhthing is goog to go - continue
        next();
        
        // res.status(200).json({
        //     ok: true,
        //     decode: decoded,
        // });

    });

}


