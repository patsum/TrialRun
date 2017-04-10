var express = require('express');
var stripeSvc = require('../services/stripe.svc');
var router = express.Router();

router.post('/', function (req, res) { // /api/donations
    var amount = Number(req.body.amount) * 100;
    stripeSvc.charge(req.body.token, amount)
        .then(function (success) {
            console.log('SUCCESS!')
            res.sendStatus(204);
        }, function (err) {
            console.log(err);
            res.sendStatus(500);
        });
});
module.exports = router;