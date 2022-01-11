const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    // message: "Too many attempts have been made for the login! Please try again later."
    handler: (req, res, next) => {
        let err = new Error("Too many attempts have been made for the login! Please try again later.");
        err.status = 429;
        next(err);
    }
})