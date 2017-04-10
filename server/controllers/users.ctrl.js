var express = require("express");
var procedures = require("../procedures/users.proc");
var auth = require("../middleware/auth.mw");
var passport = require("passport");

var router = express.Router();

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.log(err); return res.sendStatus(500);
        }
        if (!user) {
            return res.status(401).send(info);
        }
        req.logIn(user, function (err) {
            if (err) { return res.sendStatus(500); }
            else {
                eSvc.sendEmail(user.email,
                "You done logged in",
                "you done did logged in");
                 return res.send(user); }
        });
    })(req, res, next);
});

router.get("/logout", function(req, res) {
    req.session.destroy(function() {
        req.logOut();
        res.sendStatus(204);
    })
});

router.all("*", auth.isLoggedIn);

router.route('/')
router.get(function (req, res) {
    procedures.all().then(function (success) {
        res.send(success);
    }, function (err) {
        console.log(err);
        res.status(500).send(err);
    })
    .post(function (req, res) {
    procedures.all().then(function (success) {
        res.send(success);
    }, function (err) {
        console.log(err);
        res.status(500).send(err);
});

router.get("/me", function(req, res) {
    res.send(req.user);
});

router.route('/:id')
    .get(function (req, res) {
        procedures.read(req.params.id).then(function (success) {
            res.send(success);
        }, function (err) {
            console.log(err);
            res.status(500).send(err);
        })
    })
    .delete(function(req, res) {
        procedures.delete(req.params.id).then(function() {
            res.sendStatus(201);
        }, function(err) {
            console.log(err);
            res.status(500).send(err);
        })
    })

module.exports = router;