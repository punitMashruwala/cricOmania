const express = require('express');
const morgan = require('morgan');
const methodOverride = require("method-override")

var moment = require('moment');

const mongoose = require('mongoose');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');


const cricRoutes = require("./routes/cricRoutes");
const mainRoutes = require("./routes/mainRoutes");
const userRoutes = require("./routes/userRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const rsvpRoutes = require("./routes/rsvpRoutes");

const app = express();

//configure app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

let mongoUrl = 'mongodb://localhost:27017/cricomania';
//connect to database
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB is connected!!!")
        //start the server
        app.listen(port, host, () => {
            console.log('Server is running on port', port);
        });
    })
    .catch(err => console.log(err.message));


//mount middlware
app.use(
    session({
        secret: "1P9U1N1I9T5",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongoUrl: mongoUrl }),
        cookie: { maxAge: 60 * 60 * 1000 }
    })
);

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});


// mount middleware functions
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'))
app.locals.moment = moment;


//setup routes
app.use('/', mainRoutes);
app.use('/users', userRoutes);
app.use('/news', cricRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/rsvp', rsvpRoutes);


app.use((req, res, next) => {
    let err = new Error("This server cannot locate: " + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render("./partials/error", { error: err });
})
