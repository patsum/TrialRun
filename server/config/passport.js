var express = require("express");
var passport = require("passport");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var LocalStrategy = require("passport-local").Strategy;
var userProc = require("../procedures/users.proc");
var pool = require("./db").pool;

function configurePassport(app) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
        userProc.readByEmail(email).then(function(user) {
            if(!user) {
                return done(null, false);
            }
            if(user.password !== password) {
                return done(null, false, {message: "Nope!"});
            }
            return done(null, user);
        }, function(err) {
            return done(err);
        })
    }));
    //SET UP HOW TO HANDLE USER-SERIALIZATION
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })
    //SET UP HOW TO HANDLE USER-DESERIALIZATION
    passport.deserializeUser(function(id, done) {
        userProc.read(id).then(function(user) {
            done(null, user);
        }, function(err) {
            done(err);
        })
    })
    //CONFIGURE OUR DATABASE TO CREATE A 'SESSIONS' TABLE
    //AND START STORING USER SESSIONS THERE
    var sessionStore = new MySQLStore({
        createDatabaseTable: true
    }, pool);
    //CONFIGURE OUR SESSIONS TO HAVE THESE PROPERTIES
    app.use(session({
        secret: 'randomly-generated string!',
        store: sessionStore, 
        resave: false,
        saveUninitialized: false
    }))
    //START UP PASSPORT AND BIND EXPRESS SESSIONS THROUGH IT
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = configurePassport;