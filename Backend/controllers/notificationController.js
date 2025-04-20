const Notification = require('../models/notification');

// Controller to create a new notification
const createNotification = async (req, res) => {
    const { user, message } = req.body;
    try {
        const notification = new Notification({
            user,
            message
        });
        await notification.save();
        res.status(201).send(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create notification" });
    }
};

// Controller to get all notifications for a user
const getUserNotifications = async (req, res) => {
    const userId = req.params.userId;
    try {
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve notifications" });
    }
};

// Controller to mark a notification as read
const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.notificationId;
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark notification as read" });
    }
};

const markAllNotificationAsRead = async (req, res) => {
    const userId = req.params.userId;
    try {
        await Notification.updateMany({ user: userId }, { read: true });
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
}

const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        await notification.remove();
        res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete notification" });
    }

}

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationAsRead
};
