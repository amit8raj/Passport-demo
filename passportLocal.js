/**
 * Created by amitraj on 31/7/14.
 */
var express = require('express');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var testUrl = "mongodb://localhost/localDb";
app.use(app.router);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
    console.log('hello');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('desrialize');
    done(null, user);
});


passport.use(new LocalStrategy(function (username, password, done) {
    console.log("hello>>>>",username);
    newUsers({
        'name': username
    }, function (err, user) {
        if (err) {
            return done(err);
        }


        if (!user) {
            return done(null, false);
        }

        if (user.password != password) {
            return done(null, false);
        }

        return done(null, user);
    });
    //});
}));
mongoose.connect(testUrl, function (err) {
    if (err)
        console.log("error occurred");
    else
        console.log("no error occurred...connection created");
})

var userSchema = new mongoose.Schema({
    name: {type: String, index: {unique: true}},
    age: {type: Number, min: 18, max: 30},
    password: {type: String, min: 4, max: 10}
});


var newUsers = mongoose.model('Users', userSchema)
var SampleUser = new newUsers({
    name: 'Amit',
    age: 24,
    password: 'amitraj'
})


// SampleUser.save(function (err) {
// if (err)
// console.log("Error occur while saving the file");
// else
// console.log("Data saved successfully");
// })

app.get('/login', function (req, res) {
    res.sendfile('./passportTest.html');
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/loginFailure'
    })
);

app.get('/loginFailure', function (req, res, next) {
    res.send('Failed to authenticate');
});

app.get('/loginSuccess', function (req, res, next) {
    res.send('Successfully authenticated');
});


app.listen(19393);