var express = require('express');
var router = express.Router();

var Customer = require('../models/customer');
var User = require('../models/user');
var jwt = require('jsonwebtoken');



router.get('/', function(req, res, next) {
    Customer.find()
        .populate('user updateUser')
        .exec(function(err, customers) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: customers
            });
        });
});

router.get('/:userId', function(req, res, next) {
    User.findById(req.params.userId, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }

        console.log('User: ');
        console.log(user);
        Customer.find({
                user: user
            })
            .populate('user updateUser')
            .exec(function(err, customers) {
                if (err) {
                    return res.status(500).json({
                        title: 'Error',
                        error: err
                    });
                }
                res.status(200).json({
                    message: 'Success',
                    obj: customers
                });
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
                title: 'Error',
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

        User.findById(req.body._userId, function(err, ipm) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    error: err
                });
            }

            //console.log('Current User: ');
            //console.log(user);
            //console.log('IPM: ');
            //console.log(ipm);
            var customer = new Customer({
                h1: req.body.h1,
                name: req.body.name,
                status: req.body.status,
                note: req.body.note,
                user: ipm,
                initialDt: req.body.initialDt,
                updateDt: req.body.updateDt,
                updateUser: user
            });
            //console.log('Customer: ');
            //console.log(customer);
            customer.save(function(err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'Error',
                        error: err
                    });
                }
                res.status(201).json({
                    title: 'Success',
                    error: {
                        message: 'Customer added'
                    },
                    obj: result
                });
            });

        });

    });
});

router.patch('/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Customer.findById(req.params.id, function(err, customer) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        //console.log(customer);
        if (!customer) {
            return res.status(500).json({
                title: 'No Customer Found',
                error: {
                    message: 'Customer not found'
                }
            });
        }
        if (customer.user != decoded.user._id && !decoded.user.admin) {
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
        customer.user = req.body._userId;
        customer.initialDt = req.body.initialDt;
        customer.updateDt = req.body.updateDt;
        customer.updateUser = req.body._updateUserId;
        customer.deleted = req.body.deleted;
        customer.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                title: 'Success',
                error: {
                    message: 'Customer updated'
                },
                obj: result
            });
        });

    });
});

router.delete('/:_id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Customer.findById(req.params._id, function(err, customer) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
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
        if (!decoded.user.admin) {
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
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                title: 'Success',
                error: {
                    message: 'Customer deleted'
                },
                obj: result
            });
        });

    });
});

module.exports = router;
