const users = require('../models/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');


exports.getLogin = async ( req, res ) => {
    try {
        await res.status(200).render('login' , { 
            // user: req.user || null,
            message: res.locals.message,
         });
    } catch (error) {
        await res.status(500).send("Internal Server Error")
    }
}


exports.loginUser = async ( req, res ) => {
    const { email , password } = req.body;
    
    try {
        const user = await users.findOne({
           email: email,
        });

        if(!user) {
                return await res.status(404).render('login' , { 
                message: "user not found, please signup.",
            //     user: req.user || null
            });
        }

        const passwordValid = await argon2.verify( user.password , password );
        if(!passwordValid) {
            return await res.status(401).render('login', { 
                message: "Incorrect credentials. please try again.",
                // user: req.user || null
            });
        }
        // console.log(user)
        const token = jwt.sign({
            id: user._id,
            email: user.email,
        }, process.env.JWT_SECRET_KEY, { 
            expiresIn: '7d' 
        });
        
        res.cookie("token" ,token ,{
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        req.flash('message' , "Login successfully!");
        return await res.redirect("/");
        
    } catch (error) {
        console.error("error: ", error);
        res.status(500).send("internal server error");
    }
}


exports.logOutUser = async ( req, res ) => {
    try {
        res.clearCookie('token');
        req.flash('message', "Logout successfully!")
        return await res.redirect("/login");
    } catch (error) {
        console.error("error: ", error);
        res.status(500).send("internal server error");
    }
}