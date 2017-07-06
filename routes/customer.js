var express = require('express');
var router = express.Router();

var Customer = require('../models/customer');
var User = require('../models/user');

router.post('/', function(req, res, next) {
    var customer = new Customer(
        req.body.h1,
        req.body.name,
        req.body.status,
        req.body.user,
        req.body.initialDt,
        req.body.updateDt,
        req.body.updateUser
    );

    customer.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'Saved Customer',
            obj: result
        });
    });
});

module.exports = router;
