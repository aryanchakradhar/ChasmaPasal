import { Link } from "react-router-dom"

const NotificationModal = ({notifications}) => {
  return (
    <div className="p-8 w-[38rem]">
      <h1>Notifications</h1>
      <div className="mt-4">
       {
          notifications.map((notification) => (
            <div key={notification._id} className=' cursor-pointer'>
              <p>{notification.message}</p>
              <hr />
            </div>
          ))
       }
      </div>
      <div className=" mt-2 border-1 border-black bg-slate-400 p-2 rounded-sm">
        <Link to={"/notifications"}>
          Show All Notification
        </Link>
      </div>
    </div>
  )
}

export default NotificationModal