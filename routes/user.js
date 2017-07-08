var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');


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
                message: 'Success',
                obj: users
            });
        });
});

router.post('/', function(req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        admin: req.body.admin,
        deleted: req.body.deleted
    });
    //console.log(req);
    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        res.status(201).json({
            message: 'Success',
            obj: result
        });
    });
});


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
            expiresIn: 7200
        });
        res.status(200).json({
            message: 'Success',
            token: token,
            userId: user._id,
            admin: user.admin,
            deleted: user.deleted
        });
    });
});


router.patch('/changePassword', function(req, res, next) {
    User.findById(req.body._userId, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Error',
                error: err
            });
        }
        if (!user) {
            return res.status(500).json({
                title: 'No User Found',
                error: {
                    message: 'User not found'
                }
            });
        }
        if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
            return res.status(401).json({
                title: 'Update failed',
                error: {
                    message: 'Invalid password'
                }
            });
        }
        user.password = bcrypt.hashSync(req.body.newPassword, 10);
        user.save(function(err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Error',
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

module.exports = router;
