import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CircleUser, ShoppingCart, Bell } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import Cart from "@/components/Cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import NotificationModal from "@/components/NotificationModal";
import { NotificationContext } from "@/context/NotificationContext";
import { CartContext } from "@/context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const { notifications, setNotifications } = useContext(NotificationContext);
  const { cartCount } = useContext(CartContext);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!UserInfo) {
      navigate("/login");
    }
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${baseUrl}/notification/${UserInfo._id}`);
        const data = await response.json();
        setNotifications(data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNotifications();
    setUserData(UserInfo);
  }, [navigate, setNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between w-screen bg-mainbg py-4 shadow-md px-5">
        <Link to="/" className="flex items-center gap-4 font-semibold">
          <img src="/images/Logo.png" alt="ChasmaPasal" className="h-15 w-14" />
          <span className="text-black">ChasmaPasal</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-14">
          {userData.role !== "doctor" && (
            <Link to="/" className="text-black hover:text-gray-600">Home</Link>
          )}
          <Link to="/products" className="text-black hover:text-gray-600">AR Glasses</Link>
          {userData.role !== "doctor" && (
            <Link to="/AppointmentForm" className="text-black hover:text-gray-600">Appointments</Link>
          )}
          <Link to="/doctor-reviews" className="text-black hover:text-gray-600">Reviews</Link>
          {userData.role === "admin" && (
            <>
              <Link to="/orders" className="text-black hover:text-gray-600">Orders</Link>
              <Link to="/add-doctor" className="text-black hover:text-gray-600">Add Doctor</Link>
            </>
          )}
          <Link to="/user" className="text-black hover:text-gray-600">Profile</Link>
          <Link to="/aboutus" className="text-black hover:text-gray-600">About Us</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6 relative">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setShowNotifications(prev => !prev)} className="relative">
              <Bell className="h-5 w-5 text-black" />
              {notifications.filter((n) => !n.read).length > 0 && (
                <Badge className="absolute -top-2 -right-2 text-white bg-black text-xs px-1.5">
                  {notifications.filter((n) => !n.read).length}
                </Badge>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 z-50">
                <NotificationModal
                  notifications={notifications.filter((n) => !n.read)}
                />
              </div>
            )}
          </div>

          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full relative">
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-[70vw] max-w-[700px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[700px] p-0 flex flex-col"
              >
              <SheetHeader className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Cart</h2>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                <Cart />
              </div>
            </SheetContent>
          </Sheet>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-mainbg p-0">
                <CircleUser className="h-full w-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{userData.firstName} {userData.lastName}</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow w-screen h-full overflow-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 w-full py-6 border-t">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About ChasmaPasal</h3>
              <p className="text-justify">
                ChasmaPasal is your go-to eyewear store in Nepal—cool, stylish, and super easy to shop from...
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-gray-600 hover:text-black">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-black">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-black">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact Info</h3>
              <ul className="space-y-2">
                <li>chasmapasal@gmail.com</li>
                <li>01-1234567</li>
                <li>+977-9875684632</li>
                <li>Kamalpokhari, Kathmandu</li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <h3 className="font-semibold text-gray-800 mb-2">Follow Us</h3>
              <div className="flex gap-4 text-3xl">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={['fab', 'facebook']} className="text-black hover:text-blue-600" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={['fab', 'instagram']} className="text-black hover:text-pink-600" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={['fab', 'x-twitter']} className="text-black hover:text-blue-400" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-xs mt-6 text-gray-500">
            © {new Date().getFullYear()} ChasmaPasal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
