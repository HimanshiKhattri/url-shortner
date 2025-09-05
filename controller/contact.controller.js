const contacts = require('../models/contact');

exports.getContactPage = async ( req, res ) => {
        
        try {
           return await res.status(200).render('contact' , {
            message: res.locals.message,
           });
            
        } catch (error) {
            res.status(500).send('internal server error');
        }
}

exports.getContactDetails = async ( req, res ) => {
    const { name , email , message } = req.body;
    console.log(req.body);
    try {
        if(!name || !email || !message) {
            return await res.render("contact" , {
                message: "every field is required",
           });
        }

        const newContact = new contacts({
        name,
        email,
        message,
        });
        await newContact.save();
        req.flash("message" , "Your message has been successfully submitted!")
        await res.status(200).redirect("/contact")
    } catch (error) {
        res.status(500).send("internal server error")
    }
}