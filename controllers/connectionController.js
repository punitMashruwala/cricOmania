const model = require('../models/newsModel');
const moment = require('moment');

exports.index = (req, res, next) => {
    // res.send('send all stories');
    model.find()
        .then(news => {
            let dataObject = {};
            if (news.length) {
                news.map(newsValue => {
                    if (dataObject[newsValue.category]) {
                        dataObject[newsValue.category].push(newsValue)
                    } else {
                        dataObject[newsValue.category] = [newsValue]
                    }
                })
            }
            res.render('./connections/index', { dataObject })
        }).catch(err => {
            next(err);
        });
};


exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
        .then(newsResult => {
            if (newsResult) {
                res.render('./connections/show', { newsResult })
            } else {
                let err = new Error("Cannot Find a news with id: " + id);
                err.status = 404;
                next(err);
            }
        }).catch(err => {
            next(err);
        });
};

exports.edit = (req, res, next) => {
    // res.send('send the edit form');
    let id = req.params.id;
    model.findById(id)
        .then(newsResult => {
            if (newsResult) {
                res.render('./connections/edit', { newsResult })
            } else {
                let err = new Error("Cannot Find a news with id: " + id);
                err.status = 404;
                next(err);
            }
        }).catch(err => {
            next(err);
        });
};

exports.update = (req, res, next) => {
    // res.send('update news with id ' + req.params.id);
    let news = req.body;
    let id = req.params.id;
    news.date = moment(news.date).toDate();
    model.findByIdAndUpdate(id, news, { useFindAndModify: false, runValidators: true })
        .then(result => {
            if (result) {
                res.redirect('/news/' + id);
            } else {
                let err = new Error("Cannot Find a news with id: " + id);
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

exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, { useFindAndModify: false }).then(result => {
        if (result) {
            res.redirect('/news');
        } else {
            let err = new Error("Cannot Find a news with id: " + id);
            err.status = 404;
            next(err);
        }
    }).catch(err => {
        next(err);
    });
}

exports.new = (req, res) => {
    res.render('./connections/create');
};

exports.create = (req, res, next) => {
    //res.send('Created a new story');
    let news = new model(req.body);
    news.date = moment(news.date).toDate();
    news.createdBy = req.session.user.id;
    news.save()
        .then(result => {
            res.redirect('./news');
        }).catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', 'There are some Validation error: ' + err.message);
                res.redirect('back');
            } else {
                next(err);
            }
        })
};