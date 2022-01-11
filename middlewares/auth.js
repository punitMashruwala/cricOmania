const schedule = require("../models/scheduleModel");
const rsvp = require("../models/rsvpModel");

exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already!')
        return res.redirect('/users/profile');
    }
}

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to login first!')
        return res.redirect('/users/login');
    }
}

exports.isRsvpCreator = (req, res, next) => {
    let id = req.params.id;
    rsvp.findById(id)
        .then((rsvpData) => {
            if (rsvpData) {
                schedule.find({ _id: rsvpData.scheduleId }).then(result => {
                    if (result) {
                        if (result.createdBy != req.session.user.id) {
                            return next()
                        } else {
                            let err = new Error('You cannot RSVP your own schedule');
                            err.status = 401;
                            return next(err);
                        }
                    } else {
                        let err = new Error('Unable to find any Schedule record for the id: ' + id);
                        err.status = 404;
                        return next(err);
                    }
                }).catch(err => next(err));
            } else {
                let err = new Error('Unable to find any RSVP record for the id: ' + id);
                err.status = 404;
                return next(err);
            }
        }).catch(err => next(err));
}

exports.isCreator = (req, res, next) => {
    let id = req.params.id;
    schedule.findById(id).then(result => {
        if (result) {
            if (result.createdBy != req.session.user.id) {
                return next()
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Unable to find any record for the id: ' + id);
            err.status = 404;
            return next(err);
        }
    }).catch(err => next(err));
}

exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    schedule.findById(id).then(result => {
        if (result) {
            if (result.createdBy == req.session.user.id) {
                return next()
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Unable to find any record for the id: ' + id);
            err.status = 404;
            return next(err);
        }
    }).catch(err => next(err));
}