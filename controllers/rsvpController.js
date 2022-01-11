const model = require('../models/scheduleModel');
const rsvpModel = require('../models/rsvpModel');
const moment = require('moment');

exports.rsvpUpdate = (req, res, next) => {
    let id = req.params.id;
    let usrId = req.session.user.id;
    let emailId = req.session.user.email;
    let key = req.body.response.toUpperCase();

    rsvpModel.find({ scheduleId: id, emailId })
        .then(data => {
            if (data && data.length) {
                data[0].response = key;
                console.log(data[0])
                rsvpModel.findByIdAndUpdate(data[0]._id, data[0], { useFindAndModify: false, runValidators: true })
                    .then(result => {
                        if (result) {
                            req.flash('success', 'You have successfully updated your RSVP');
                            res.redirect('/schedule/' + id);
                        } else {
                            let err = new Error("Cannot Find a rsvp data with id: " + id);
                            err.status = 404;
                            next(err);
                        }
                    }).catch(err => {
                        if (err.name === 'ValidationError') {
                            req.flash('error', 'There are some Validation error: ' + err.message);
                            res.redirect('back');
                        } else {
                            next(err);
                        }
                    });
            } else {
                rsvpData = new rsvpModel({
                    response: key,
                    userId: usrId,
                    emailId: emailId,
                    scheduleId: id
                });
                rsvpData.save()
                    .then(result => {
                        req.flash('success', 'You have successfully updated your RSVP');
                        res.redirect('/schedule/' + id);
                    }).catch(err => {
                        if (err.name === 'ValidationError') {
                            req.flash('error', 'There are some Validation error: ' + err.message);
                            res.redirect('back');
                        } else {
                            next(err);
                        }
                    })
            }
        }).catch(err => {
            next(err);
        })
}

exports.rsvpDelete = (req, res, next) => {
    let id = req.params.id;
    console.log(id)
    rsvpModel.findByIdAndDelete(id, { useFindAndModify: false })
        .then(result => {
            if (result) {
                req.flash('success', 'You have successfully deleted a rsvp record');
                res.redirect('/users/profile');
            } else {
                let err = new Error("Cannot Find a schedule with id: " + id);
                err.status = 404;
                next(err);
            }
        }).catch(err => {
            next(err);
        });
}