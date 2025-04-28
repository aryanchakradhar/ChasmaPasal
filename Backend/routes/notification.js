const express = require('express');
const router = express.Router();
const { createNotification, getUserNotifications, markNotificationAsRead, deleteNotification, markAllNotificationAsRead,deleteAllNotifications, } = require('../controllers/notificationController');

router.route('/').post(createNotification);
router.route('/:userId').get(getUserNotifications).put(markAllNotificationAsRead);
router.route('/:id').put(markNotificationAsRead).delete(deleteNotification);
router.delete("/notification/all/:userId", deleteAllNotifications);


module.exports = router;