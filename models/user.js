var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    customers: [{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }]
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);
