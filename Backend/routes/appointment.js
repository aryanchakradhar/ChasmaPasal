const express = require('express');
const router = express.Router();
const {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByUser
} = require('../controllers/appointmentController');

router.route('/').post(createAppointment).get(getAppointments);
router.route('/:id').put(updateAppointment).delete(deleteAppointment);
router.route('/:userId').get(getAppointmentsByUser);

module.exports = router;