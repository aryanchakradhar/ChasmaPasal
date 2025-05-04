const express = require('express');
const router = express.Router();
const { 
    createNotification, 
    getUserNotifications, 
    markNotificationAsRead, 
    deleteNotification, 
    markAllNotificationAsRead, 
    deleteAllNotifications 
} = require('../controllers/notificationController');

// Create a new notification
router.post('/', createNotification);

// Get all notifications for a specific user and mark all as read
router.route('/:userId')
    .get(getUserNotifications)   // Get user notifications
    .put(markAllNotificationAsRead); // Mark all notifications as read

// Mark a specific notification as read or delete it
router.route('/:id')
    .put(markNotificationAsRead)   // Mark a specific notification as read
    .delete(deleteNotification);  // Delete a specific notification

// Delete all notifications for a user
router.delete('/all/:userId', deleteAllNotifications); // Updated path for clarity

module.exports = router;
