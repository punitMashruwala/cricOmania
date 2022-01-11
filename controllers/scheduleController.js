const model = require('../models/scheduleModel');
const rsvpModel = require('../models/rsvpModel');
const moment = require('moment');


exports.index = (req, res) => {
    model.find()
        .then(scheduleData => {
            let dataObject = {};
            if (scheduleData.length) {
                scheduleData.map(scheduleValue => {
                    if (dataObject[scheduleValue.matchType]) {
                        dataObject[scheduleValue.matchType].push(scheduleValue)
                    } else {
                        dataObject[scheduleValue.matchType] = [scheduleValue]
                    }
                })
            }
            res.render('./schedule/index', { dataObject })
        }).catch(err => {
            next(err);
        });
};


exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate("createdBy", 'firstName lastName')
        .then(scheduleResult => {
            if (scheduleResult) {
                rsvpModel.find({ scheduleId: id, response: "YES" })
                    .then(data => {
                        console.log("----------", data)
                        let count = data.length;
                        res.render('./schedule/show', { scheduleResult, count })

                    })
            } else {
                let err = new Error("Cannot Find a schedule with id: " + id);
                err.status = 404;
                next(err);
            }
        }).catch(err => {
            next(err);
        });
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
        .then(scheduleResult => {
            if (scheduleResult) {
                res.render('./schedule/edit', { scheduleResult })
            } else {
                let err = new Error("Cannot Find a schedule with id: " + id);
                err.status = 404;
                next(err);
            }
        }).catch(err => {
            next(err);
        });
};

exports.update = (req, res, next) => {
    let schedule = req.body;
    let id = req.params.id;
    schedule.date = moment(schedule.date).toDate();
    model.findByIdAndUpdate(id, schedule, { useFindAndModify: false, runValidators: true })
        .then(result => {
            if (result) {
                req.flash('success', 'You have successfully updated a schedule record');
                res.redirect('/schedule/' + id);
            } else {
                let err = new Error("Cannot Find a schedule with id: " + id);
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
};


exports.new = (req, res) => {
    res.render('./schedule/create');
};

exports.create = (req, res, next) => {
    let schedule = new model(req.body);
    schedule.date = moment(schedule.date).toDate();
    schedule.createdBy = req.session.user.id;
    schedule.save()
        .then(result => {
            req.flash('success', 'You have successfully created a new schedule record');
            res.redirect('./schedule');
        }).catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', 'There are some Validation error: ' + err.message);
                res.redirect('back');
            } else {
                next(err);
            }
        })
};


exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, { useFindAndModify: false }).then(result => {
        if (result) {
            rsvpModel.deleteMany({ scheduleId: id })
                .then(data => {
                    if (data) {
                        req.flash('success', 'You have successfully deleted a schedule record');
                        res.redirect('/schedule');
                    } else {
                        let err = new Error("Cannot Find a schedule with id: " + id);
                        err.status = 404;
                        next(err);
                    }
                }).catch(err => {
                    next(err);
                });
        } else {
            let err = new Error("Cannot Find a schedule with id: " + id);
            err.status = 404;
            next(err);
        }
    }).catch(err => {
        next(err);
    });
}


