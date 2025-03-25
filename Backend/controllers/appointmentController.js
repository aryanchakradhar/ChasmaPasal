const Appointment = require('../models/appointment');
const User = require('../models/user');
const Notification = require('../models/notification');

// Create a new appointment
const createAppointment = async (req, res) => {
  const { date, time, doctorId, patientId, contact } = req.body;
  if (!date || !time || !doctorId || !patientId || !contact) {
    return res.status(400).json({ success: false, message: 'Please enter all required fields' });
  }

  const doctor = await User.findById(doctorId);
  const patient = await User.findById(patientId);

  if (!doctor || !patient) {
    return res.status(404).json({ success: false, message: 'Doctor or patient not found' });
  }

  // Find all existing appointments for the same date and doctor
  const existingAppointments = await Appointment.find({ date, doctor: doctorId });
  // Check if there are any existing appointments
  if (existingAppointments.length > 0) {
    // Iterate through each existing appointment
    for (const existingAppointment of existingAppointments) {
      console.log(existingAppointment);
      const existingAppointmentTime = new Date('2000-01-01T' + existingAppointment.time + ':00')
      const newAppointmentTime = new Date('2000-01-01T' + time + ':00')
      const timeDifferenceMs = Math.abs(newAppointmentTime - existingAppointmentTime);
      const timeDifferenceHr = timeDifferenceMs / (1000 * 60 * 60);
      console.log(timeDifferenceHr, newAppointmentTime, existingAppointmentTime);
      if (timeDifferenceHr < 1) {
        return res.json({ 
          status: 400,
          success: false,
          message: 'Appointment already exists within 1 hour. Please change date or time' });
      }
    }
  }

  try {
    // Create the new appointment
    const appointment = await Appointment.create({
      date,
      time,
      doctor: doctorId,
      patient: patientId,
      contact
    });

    // Create a notification for the doctor
    const notificationMessage = `New appointment scheduled with ${patient.first_name} ${patient.last_name} on ${date} at ${time}.`;
    await Notification.create({
      user: doctorId,
      message: notificationMessage
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all appointments
const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get appointments by user (doctor or patient)
const getAppointmentsByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const appointments = await Appointment.find({
      $or: [{ doctor: userId }, { patient: userId }]
    })
    .populate('doctor', 'first_name last_name')
    .populate('patient', 'first_name last_name');
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single appointment by ID
const getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update an existing appointment
const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        res.status(204).json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    getAppointmentsByUser,
    getAppointment,
    updateAppointment,
    deleteAppointment
};
