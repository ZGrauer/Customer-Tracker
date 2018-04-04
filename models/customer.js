var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    h1: {
        type: Number,
        required: true,
        min: 100000000,
        max: 999999999,
        index: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        default: 'Engaged ESSS'
    },
    note: {
        type: String,
        default: ''
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    initialDt: {
        type: Date,
        default: Date.now
    },
    updateDt: {
        type: Date,
        default: Date.now
    },
    updateUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    loeTotalHours: {
        required: true,
        type: Number,
        default: 0
    }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('Customer', schema);
