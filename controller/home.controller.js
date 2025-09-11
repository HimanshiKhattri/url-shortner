const shorteners = require("../models/shorteners")

exports.getHome =  async( req, res ) => {
    try {
        let links = [];

        if(req.user) {
            links =  await shorteners.find({ userId: req.user.id});
        }
        // console.log("links: ", links);
        res.status(200).render("index", {
        links: links,
        message: res.locals.message,
        // host: req.host,
        // user: req.user || null
    });
    } catch (error) {
        console.log("error: " , error);
        res.status(500).send('Something went wrong!');
    }
}


exports.postUrl =  async ( req, res ) => {
  try {
    const { url , shortUrl} = req.body;
    const customUrl = (Math.random()+ 1).toString(36).substring(5);
    const finalShotener = shortUrl || customUrl;

    // user logged in or not
    if(!req.user) {
        req.flash("message", "You need to be logged in to shorten URLs.");
        return res.status(401).redirect('/login')
        // return res.status(401).render("index", {
        //     links: [],
        //     message: 'you need to be logged in to shorten URLs.',
        //     host: req.host,
        //     user: null,
        // });
    }
    const exitsShortener =  await shorteners.findOne( { shortUrl : finalShotener} );
    if(exitsShortener) {
        let links = [];
        if(req.user) {
            links = await shorteners.find({ userId: req.user.id });
        }
        return res.status(400).render("index", {
            // longUrl : url,
            // shortUrl : "",
            links: links,
            // host: req.host,
            // user: req.user || null,
            message : "This Short URL is already taken, please Try another."
        });
    }

    const newShortener = new shorteners( {
        longUrl : url,
        shortUrl : finalShotener,
        userId: req.user ? req.user.id : undefined
    });
    await newShortener.save();

    let links = [];
    if(req.user) {
        links = await shorteners.find({ userId: req.user.id })
    }
    res.render("index", {
        // host: req.host,
        links: links,
        // user: req.user || null,
        message: "Short URL Created!"
    });
  } catch (error) {
    console.log("error: ", error.message);
    res.status(500).send('Something went wrong!');
  }

}