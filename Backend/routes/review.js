const express = require('express');
const router = express.Router();

const {
  getReviews,
    getDoctorReviews,
    updateReview,
    deleteReview,
    addReview,
} = require('../controllers/doctorReviewController');

router.route('/').get(getReviews).post(addReview);
router.route('/:id').get(getDoctorReviews).put(updateReview).delete(deleteReview);

module.exports = router;