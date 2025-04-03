// controller for doctor review

const Review = require('../models/review');

// get all reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('doctor').populate('patient');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get reviews for a specific doctor
const getDoctorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ doctor: req.params.id }).populate('doctor').populate('patient');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get reviews for a specific patient
const getPatientReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ patient: req.params.patientId }).populate('doctor').populate('patient');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// add a review
const addReview = async (req, res) => {
    const review = new Review({
        doctor: req.body.doctorId,
        patient: req.body.patientId,
        rating: req.body.rating,
        review: req.body.review
    });

    try {
        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// update a review
const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (req.body.doctor) {
            review.doctor = req.body.doctor;
        }
        if (req.body.patient) {
            review.patient = req.body.patient;
        }
        if (req.body.rating) {
            review.rating = req.body.rating;
        }
        if (req.body.review) {
            review.review = req.body.review;
        }

        const updatedReview = await review.save();
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// delete a review
const deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getReviews,
    getDoctorReviews,
    updateReview,
    deleteReview,
    addReview,
    getPatientReviews
}