var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var Customer = require('../models/customer');
var User = require('../models/user');


/**
 * router.get '/' - returns all customer objects in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /customer/
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
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


/**
 * router.get '/:userId' - returns all customer objects in the mongoDB for the specified userId.
 *                         :userId = param equaling the user's id in the mongoDB
 *
 * @param  {type} '/:userId' path for request. Is equalto /customer/:userId
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
router.get('/:userId', function(req, res, next) {
    User.findById(req.params.userId, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }

        //console.log('User: ');
        //console.log(user);
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


/**
 * router.use '/' - Ensures all functions beyond this point are only done by authenticated users
 *
 * @param  {type} '/' path for request. Is equalto /customer/
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
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

/**
 * router.post '/' - Adds a new customer to the database.  User must have valied JWT.
 *
 * @param  {type} '/' path for request. Is equalto /customer/
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
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
                updateUser: user,
                loeTotalHours: req.body.loeTotalHours
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


/**
 * router.patch '/:id' - Updates an existing customer to the database.
 *                       User must have valied JWT. Own the customer or be an Admin
 *                       :id = param equaling the customer id in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /customer/:id
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
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
        customer.loeTotalHours = req.body.loeTotalHours;
        //console.log(customer);
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


/**
 * router.delete '/:_id' - Deletes an existing customer from the database.
 *                         User must have valied JWT and be an Admin
 *                         :_id = param equaling the customer id in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /customer/
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
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
