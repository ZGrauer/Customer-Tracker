var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');


/**
 * router.get '/' - returns all user objects in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /user/
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
router.get('/', function(req, res, next) {
    User.find()
        .exec(function(err, users) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                title: 'Success',
                message: 'Returned Users',
                obj: users
            });
        });
});


/**
 * router.post '/' - add a new user object in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /user/
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
router.post('/', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);

    if (!decoded.user.admin) {
        return res.status(500).json({
            title: 'Not Authorized',
            error: {
                message: 'User not authorized'
            }
        });
    }
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        admin: req.body.admin,
        deleted: req.body.deleted
    });

    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        res.status(201).json({
            title: 'Success',
            error: {
                message: 'Added user'
            },
            obj: result
        });
    });
});


/**
 * router.patch '/changePassword' - changes the logged in user's password in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /user/changePassword
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
router.patch('/changePassword', function(req, res, next) {
    //console.log(req.body);
    User.findById(req.body._userId, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        if (!user) {
            return res.status(500).json({
                title: 'Error',
                error: {
                    message: 'User not found'
                }
            });
        }
        //console.log(user);

        if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
            return res.status(401).json({
                title: 'Error',
                error: {
                    message: 'Update failed. Invalid password'
                }
            });
        }
        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        //console.log(user);
        user.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                title: 'Success',
                error: {
                    message: 'Password updated'
                },
                obj: result
            });
        });

    });
});


/**
 * router.patch '/:id' - updates the user identified by :id in the mongoDB.
 *                         :id = param equaling the user's id in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /user/:id
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
router.patch('/:id', function(req, res, next) {
    //console.log('Server is updating User...');
    var decoded = jwt.decode(req.query.token);
    User.findById(req.params.id, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        if (!user) {
            return res.status(500).json({
                title: 'Error',
                error: {
                    message: 'User not found.  Cannot update.'
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

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.password = bcrypt.hashSync(req.body.password, 10);
        user.email = req.body.email;
        user.admin = req.body.admin;
        user.deleted = req.body.deleted;
        user.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                title: 'Success',
                error: {
                    message: 'User Updated'
                },
                obj: result
            });
        });

    });

});


/**
 * router.delete '/:_id' - deletes the user identified by :id in the mongoDB.
 *                         :_id = param equaling the user's id in the mongoDB
 *
 * @param  {type} '/' path for request. Is equalto /user/:_id
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error
 */
router.delete('/:_id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(req.params._id, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        if (!user) {
            return res.status(500).json({
                title: 'Error',
                error: {
                    message: 'User not found'
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
        user.remove(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
                    error: err
                });
            }
            res.status(200).json({
                title: 'Success',
                error: {
                    message: 'Deleted user'
                },
                obj: result
            });
        });
    });
});

/**
 * router.post '/signin' - Authenticates the user and logs in. Creates & returns a JWT in local storage
 *
 * @param  {type} '/' path for request. Is equalto /user/signin
 * @param  {object} req req object represents the HTTP request and has properties for the request query string, parameters, body, HTTP headers, and so on.
 * @param  {object} res res object represents the HTTP response that an Express app sends when it gets an HTTP request
 * @param  {object} next Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.
 * @returns {object} json object with title and message indicating success or error.  Contains JWT
 */
router.post('/signin', function(req, res, next) {
    User.findOne({
        email: req.body.email
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {
                    message: 'Invalid login credentials'
                }
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {
                    message: 'Invalid login credentials'
                }
            });
        }
        // UPDATE 'secret' FOR PRODUCTION
        var token = jwt.sign({
            user: user
        }, 'secret', {
            expiresIn: 28800
        });
        res.status(200).json({
            title: 'Success',
            error: {
                message: 'Logged in'
            },
            token: token,
            userId: user._id,
            admin: user.admin,
            deleted: user.deleted
        });
    });
});


module.exports = router;