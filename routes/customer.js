var express = require('express');
var router = express.Router();

var Customer = require('../models/customer');
var User = require('../models/user');
var jwt = require('jsonwebtoken');



router.get('/', function(req, res, next) {
    Customer.find()
        .populate('user', 'firstName lastName')
        .exec(function(err, customers) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: customers
            });
        });
});

router.use('/', function(req, res, next) {
    jwt.verify(req.query.token, 'secret', function(err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    })
});

router.post('/', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    //console.log('Decoded JWT: ');
    //console.log(decoded);
    //console.log('Request Body: ');
    //console.log(req.body);

    User.findById(decoded.user._id, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!user.admin || user.deleted) {
            return res.status(401).json({
                title: 'Not Authorized',
                error: {
                    message: 'User not authorized'
                }
            });
        }
        var customer = new Customer({
            h1: req.body.h1,
            name: req.body.name,
            status: req.body.status,
            note: req.body.note,
            user: user,
            initialDt: req.body.initialDt,
            updateDt: req.body.updateDt,
            updateUser: user
        });
        console.log(customer);
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
});

router.patch('/:id', function(req, res, next) {
    Customer.findById(req.params._id, function(err, customer) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!customer) {
            return res.status(500).json({
                title: 'No Customer Found',
                error: {
                    message: 'Customer not found'
                }
            });
        }
        if ((customer.user != decoded.user._id) && !decoded.admin) {
            return res.status(500).json({
                title: 'Not Authorized',
                error: {
                    message: 'User not authorized'
                }
            });
        }
        customer.h1 = req.body.h1;
        customer.name = req.body.name;
        customer.status = req.body.status;
        customer.note = req.body.note;
        customer.user = req.body.user;
        customer.initialDt = req.body.initialDt;
        customer.updateDt = req.body.updateDt;
        customer.updateUser = req.body.updateUser;
        customer.deleted = req.body.deleted;
        customer.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: result
            });
        });

    });
});

router.delete('/:id', function(req, res, next) {
    Customer.findById(req.params._id, function(err, customer) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!customer) {
            return res.status(500).json({
                title: 'No Customer Found',
                error: {
                    message: 'Customer not found'
                }
            });
        }
        if (!decoded.admin) {
            return res.status(500).json({
                title: 'Not Authorized',
                error: {
                    message: 'User not authorized'
                }
            });
        }
        customer.remove(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted customer',
                obj: result
            });
        });

    });
});

module.exports = router;
