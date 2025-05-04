import { Link } from "react-router-dom";
import { Bell, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationModal = ({ notifications }) => {
  return (
    <div className="w-[28rem] max-h-[32rem] overflow-hidden rounded-lg shadow-xl bg-white border border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-black" />
          <h1 className="text-lg font-semibold text-black">
            Notifications
          </h1>
        </div>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-black">
          {notifications.length} New
        </span>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-gray-200 max-h-[20rem] overflow-y-auto">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-black"></div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-black">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="p-8 text-center">
            <Bell className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-black">
              No notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any notifications yet.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-white text-center">
        <Link
          to="/notifications"
          className="inline-flex items-center text-sm font-medium text-black hover:text-gray-700 transition-colors"
        >
          View all notifications
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationModal;
