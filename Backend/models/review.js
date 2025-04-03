// review system for doctors

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user')

const reviewSchema = new Schema({
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
