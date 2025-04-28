import { Button } from '@/components/ui/button';
import { NotificationContext } from '@/context/NotificationContext';
import { useContext, useEffect, useState } from 'react';

const NotificationPage = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const {notifications, setNotifications} = useContext(NotificationContext)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${baseUrl}/notification/${userInfo._id}`);
        const data = await response.json();
        setNotifications(data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const response = await fetch(`${baseUrl}/notification/${userInfo._id}`, {
        method: 'PUT',
      });
      const data = await response.json();
      setNotifications(data)
    } catch (error) {
      console.error(error);
  }
  }

  const handleClearAll = async () => {
    try {
      await fetch(`${baseUrl}/notification/all/${userInfo._id}`, {
        method: 'DELETE',
      });
      setNotifications([]); // clear local state
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };
  
  return (
    <div className='container mt-4'>
      <h1 className=' font-bold'>Notifications</h1>
      <Button onClick={handleMarkAllRead} variant="outline">
        Mark all as read
      </Button>
      <Button onClick={handleClearAll} variant="destructive" className="ml-4">
        Clear All
      </Button>

      <div className='mt-4 flex flex-col gap-3'>
      {
        notifications? (
          notifications.map((notification) => (
            <div key={notification._id} className=' cursor-pointer'>
              <p>{notification.message}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )
      }
      </div>
    </div>
  );
};

export default NotificationPage;