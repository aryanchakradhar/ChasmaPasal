const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByUser,
    getAvailableSlots,
    clearPastAppointments // Add this import
} = require('../controllers/appointmentController');

router.route('/available/slots').get(getAvailableSlots);
router.route('/').post(createAppointment).get(getAppointments);
router.route('/:id').put(updateAppointment).delete(deleteAppointment);
router.route('/:userId').get(getAppointmentsByUser);
router.route('/clear/past').post(clearPastAppointments); // Add this new route

module.exports = router;