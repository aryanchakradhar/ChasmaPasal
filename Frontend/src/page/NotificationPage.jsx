import { Button } from '@/components/ui/button';
import { NotificationContext } from '@/context/NotificationContext';
import { useContext, useEffect, useState } from 'react';
import { Bell, BellOff, Check, Trash2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

const NotificationPage = () => {
  const baseUrl =  import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${baseUrl}/notification/${userInfo._id}`);
        const data = await response.json();
        setNotifications(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
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
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    try {
      // Send the DELETE request to the backend to remove notifications from the database
      const response = await fetch(`${baseUrl}/notification/all/${userInfo._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to clear notifications from the server');
      }

      // If successful, clear the notifications from the frontend context as well
      setNotifications([]);
    } catch (error) {
      console.error("Failed to clear notifications", error);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center space-x-3'>
          <Bell className='h-8 w-8 text-primary' />
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Notifications</h1>
          {notifications.length > 0 && (
            <span className='px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground'>
              {notifications.length}
            </span>
          )}
        </div>
        
        <div className='flex space-x-2'>
          <Button 
            onClick={handleMarkAllRead} 
            variant="outline" 
            className='gap-2'
            disabled={notifications.length === 0}
          >
            <Check className='h-4 w-4' />
            Mark all as read
          </Button>
          <Button 
            onClick={handleClearAll} 
            variant="destructive" 
            className='gap-2'
            disabled={notifications.length === 0}
          >
            <Trash2 className='h-4 w-4' />
            Clear All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-12 space-y-4'>
          <div className='animate-pulse'>
            <Bell className='h-10 w-10 text-gray-400' />
          </div>
          <p className='text-gray-500'>Loading notifications...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className='space-y-3'>
          {notifications.map((notification) => (
            <Card 
              key={notification._id} 
              className={`p-4 transition-all hover:shadow-md ${
                notification.read ? 'bg-muted/50' : 'bg-background border-primary/30'
              }`}
            >
              <div className='flex items-start space-x-3'>
                <div className={`mt-1 h-2 w-2 rounded-full ${
                  notification.read ? 'bg-gray-400' : 'bg-primary'
                }`} />
                <div className='flex-1'>
                  <p className={`font-medium ${
                    notification.read ? 'text-gray-600' : 'text-gray-900 dark:text-white'
                  }`}>
                    {notification.message}
                  </p>
                  <div className='flex items-center mt-2 text-xs text-gray-500'>
                    <Clock className='h-3 w-3 mr-1' />
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-12 space-y-4 text-center'>
          <BellOff className='h-10 w-10 text-gray-400' />
          <h3 className='text-lg font-medium text-gray-900 dark:text-white'>No notifications</h3>
          <p className='text-gray-500'>You don't have any notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
