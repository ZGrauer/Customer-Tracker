var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Customer = require('../models/customer');

router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/', function(req, res, next) {
    var email = req.body.email;
    var firstName = req.body.firstName;
    var LastName = req.body.LastName;
    var password = req.body.password;
    var email = req.body.email;
    var user = new User({
        firstName: firstName,
        LastName: LastName,
        password: password,
        email: email
    });

    user.save();
    res.redurect('/');
});

module.exports = router;
