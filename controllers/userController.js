const model = require('../models/userModel');
const schedule = require("../models/scheduleModel");
const rsvp = require("../models/rsvpModel");


exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    req.body.email = req.body.email.toLowerCase();
    let user = new model(req.body);
    user.save()//insert the document to the database
        .then(user => {
            req.flash('success', 'You have successfully created a new account!');
            res.redirect('/users/login');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', 'There are some Validation error: ' + err.message);
                res.redirect('back');
            } else {
                if (err.code === 11000) {
                    req.flash('error', 'Email has been used');
                    res.redirect('back');
                } else
                    next(err);
            }
        });
};

exports.getUserLogin = (req, res, next) => {
    res.render('./user/login');
}

exports.login = (req, res, next) => {

    let email = req.body.email.toLowerCase();
    let password = req.body.password;
    model.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('wrong email address');
                req.flash('error', 'wrong email address');
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = { id: user._id, name: user.firstName, email: user.email };
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/users/profile');
                        } else {
                            req.flash('error', 'You have entered wrong password');
                            res.redirect('/users/login');
                        }
                    });
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user.id;
    model.findById(id).then(user => {
        if (user.teamName) {
            let query = { $or: [{ 'host': user.teamName }, { 'opponent': user.teamName }] };
            schedule.find(query).then(schedules => {
                schedule.find({ "createdBy": user._id }).then(scheduleCreatedData => {
                    rsvp.find({ emailId: user.email }).populate("scheduleId", 'tournamentTitle matchType host opponent')
                        .then(rsvpData => {
                            res.render('./user/profile', { user, schedules, scheduleCreatedData, rsvpData });
                        }).catch(err => next(err));
                }).catch(err => next(err));
            }).catch(err => next(err));
        } else {
            let schedules = [];
            res.render('./user/profile', { user, schedules })
        }
    }).catch(err => next(err));


};


exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        } else {
            // req.flash('success', 'You have successfully logged Out');
            res.redirect('/');
        }
    });

};



