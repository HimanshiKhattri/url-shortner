const jwt = require('jsonwebtoken');

const authMiddleware = ( req , res , next ) => {
    const token = req.cookies.token;
    let user = null;
    if(token) {
        try {
            const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
            req.user = decoded;
            user = decoded;
            
        } catch (error) {
            req.user = null;
            user = null;
        }
    } else {
        req.user = null;
    }

    res.locals.user = user;
    res.locals.host = req.host;
    res.locals.message = req.flash('message');
    next();
 }

 module.exports = authMiddleware