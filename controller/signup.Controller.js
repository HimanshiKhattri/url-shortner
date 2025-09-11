const users = require('../models/user');
const argon2 = require('argon2');


exports.getsignup = async (req , res) => {
    if(req.user) {
        req.flash("message" , "You have already created an account.")
        return res.redirect('/');
    }
    await res.status(200).render("signup"  , {
        user: req.user ||  null,
        message: ''
    });
} 

exports.createUser = async ( req , res ) => {
    if(req.user) {
        // already logged in
        req.flash("message", "You are already logged In, create your short URL.")
        return res.redirect('/');
    }
    
    const { name, email , password } = req.body;
    try {
        
        if(!name || !email || !password) {
            req.flash("message", "All fields are required.");
            return await res.status(400).redirect("/signup");
        }

        const existUser = await users.findOne({
            email: email
        });
        if(existUser) {
            
            return await res.status(403)
            .render("signup" , {
                user: req.user || null,
                message : " User already exists. please login." 
            });
        }

        const hashedPassword =  await argon2.hash(password);
        const user  = await users.create({ name , email , password: hashedPassword });
        // await user.save();
        req.flash("message", "Signup successfully, Please Login.");
        await res.status(201).redirect('/login');
    } catch (error) {
        console.error("error:", error.message);
        res.status(500).send( 'Internal Server Error')
    }
}

// exports.UpdateUser = async ( req, res ) => {

//     const {  name, email , password } = req.body;
//     try {
//         const user = await users.findBy(email);
//         if (!user) {
//             return await res.status(404).redirect("/login");
//         }

//         user.name = name;
//         if (password) {
//             user.password = await argon2.hash(password);
//         }

//         await user.updateOne({ name: user.name, password: user.password })
//         await res.status(200).redirect("/login" , { message : "user updated successfully"});
//     } catch (error) {
//         console.error("error:", error);
//         res.status(500).redirect("/users");
//     }
// }