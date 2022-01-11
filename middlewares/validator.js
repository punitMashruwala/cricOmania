const { body, check, validationResult } = require('express-validator');
const { DateTime } = require("luxon");


exports.validateId = (req, res, next) => {
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
}


exports.validateSignUp = [body('firstName', 'First Name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last Name cannot be empty').notEmpty().trim().escape(),
body('email', "Email id must be valid Email id address.").isEmail().trim().escape().normalizeEmail(),
body('teamName', 'Team Name cannot be empty').notEmpty().trim().escape(),
body('password', "Password must be atleast 8 charachters and atmost 64 charachters").isLength({ min: 8, max: 64 })];


exports.validateLogin = [body('email', "Email id must be valid Email id address.").isEmail().trim().escape().normalizeEmail(),
body('password', "Password must be atleast 8 charachters and atmost 64 charachters").isLength({ min: 8, max: 64 })];

exports.validateSchedule = [body('tournamentTitle', 'Title cannot be empty').notEmpty().trim().escape(),
body('host', 'Host cannot be empty').notEmpty().trim().escape(),
body('opponent', 'Opponent cannot be empty').notEmpty().trim().escape(),
body('matchType', 'Match Type cannot be empty').notEmpty().trim().escape(),
body('location', 'Location cannot be empty').notEmpty().trim().escape(),
body('startTime', 'Start Time cannot be empty').notEmpty().trim().escape(),
body('endTime', 'End Time cannot be empty').notEmpty().trim().escape(),
body('team1LogoImage', 'Team1 Logo Image cannot be empty').notEmpty().trim(),
body('team2LogoImage', 'Team2 Logo Image cannot be empty').notEmpty().trim(),
body('details', "Details must be atleast 10 charachters").isLength({ min: 10 }).trim().escape(),
check('date').trim().isDate().withMessage('Date Field should be of ISO Date format!'),
check('date').trim().isAfter(new Date().toDateString()).withMessage("Match Date should be valid and after Today's date"),
body('startTime', 'Start Time cannot be empty').notEmpty().trim().custom((value, { req }) => {
    let startDate = req.body.startTime;
    let endDate = req.body.endTime;
    let startTimeObj = DateTime.fromFormat(startDate, "hh:mm");
    let endTimeObj = DateTime.fromFormat(endDate, "hh:mm");
    if (!startTimeObj.isValid) {
        throw new Error('Date is not a valid Date');
    } else {
        if (startTimeObj < endTimeObj) {
            return true;
        } else {
            throw new Error('Event End Time should be after event start time');
        }
    }
})];

exports.validateRSVP = [body('response', "Response must be valid enums.").trim().notEmpty().isIn(["Yes", "No", "Maybe", "YES", "NO", "MAYBE", "yes", "no", 'maybe'])]

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(err => {
            req.flash('error', err.msg)
        })
        return res.redirect('back');
    } else {
        return next();
    }
}