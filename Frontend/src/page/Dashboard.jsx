import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CircleUser, Search, ShoppingCart, Bell} from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
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

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});
  const { notifications, setNotifications } = useContext(NotificationContext);
  const { cartCount } = useContext(CartContext);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

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
    console.log("Updated cart count:", cartCount);
  }, [cartCount]);
  

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between w-screen bg-mainbg py-4 shadow-md">
        <Link to="/" className="flex items-center gap-4 font-semibold ml-5">
          <img src="/images/Logo.png" alt="OpticareAR" className="h-15 w-14" />
          <span className="text-black">ChasmaPasal</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-14">
            {userData.role !== "doctor" && (
              <Link
                to="/"
                className={`text-black hover:text-gray-600 ${
                  location.pathname === "/" ? "text-primary" : ""
                }`}
              >
                Home
              </Link>
            )}
            <Link
              to="/products"
              className={`text-black hover:text-gray-600 ${
                location.pathname === "/products" ? "text-primary" : ""
              }`}
            >
              AR Glasses
            </Link>
            {userData.role !== "doctor" && (
              <Link
                to="/AppointmentForm"
                className={`text-black hover:text-gray-600 ${
                  location.pathname === "/AppointmentForm" ? "text-primary" : ""
                }`}
              >
                Appointments
              </Link>
            )}
            <Link
              to="/doctor-reviews"
              className={`text-black hover:text-gray-600 ${
                location.pathname === "/doctor-reviews" ? "text-primary" : ""
              }`}
            >
              Reviews
            </Link>

            {userData.role === "admin" && (
              <>
                <Link
                  to="/orders"
                  className={`text-black hover:text-gray-600 ${
                    location.pathname === "/orders" ? "text-primary" : ""
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/add-doctor"
                  className={`text-black hover:text-gray-600 ${
                    location.pathname === `/add-doctor`?  "text-primary" : ""
                  }`}
                >
                  Add Doctor
                </Link>
              </>
            )}

            <Link
              to="/user"
              className={`text-black hover:text-gray-600 ${
                location.pathname === "/user" ? "text-primary" : ""
              }`}
            >
              Profile
            </Link>
            <Link
              to="/aboutus"
              className={`text-black hover:text-gray-600 ${
                location.pathname === "/aboutus" ? "text-primary" : ""
              }`}
            >
              About Us
            </Link>
          </nav>


        {/* Actions */}
        <div className="flex items-center gap-8">
          {/* <form className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-72 bg-gray-100 border-2 border-gray-300 rounded-lg py-2 pl-10"
            />
          </form> */}

          <NavigationMenu className="ml-5">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Toggle notifications</span>
                  <Badge color="primary" className="absolute top-0 right-0">
                    {
                      notifications.filter((notification) => !notification.read)
                        .length
                    }
                  </Badge>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NotificationModal
                    notifications={notifications.filter(
                      (notification) => !notification.read
                    )}
                  />
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

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
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-mainbg p-0 mr-5"
              >
                <CircleUser className="h-full w-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {userData.firstName} {userData.lastName}
              </DropdownMenuItem>
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
            {/* About ChasmaPasal */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">About ChasmaPasal</h3>
              <p className="text-justify">
              Newmew is your go-to eyewear store in Nepal—cool, stylish, and super easy to shop from. Whether you're heading to the beach or a house party, we’ve got the perfect frames for you. Plus, we deliver for free all over Nepal! Powered by ChasmaPasal, we mix fashion with tech, offering virtual try-ons and smooth eye care services right from your screen.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy-policy" className="text-gray-600 hover:text-black">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-black">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-black">Contact Us</Link>
                </li>
              </ul>
            </div>


            {/* Contact Info */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={['fas', 'envelope']} /> chasmapasal@gmail.com</li>
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={['fas', 'phone']} /> 01-1234567</li>
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={['fas', 'mobile-alt']} /> +977-9875684632</li>
                <li className="flex items-center gap-2"><FontAwesomeIcon icon={['fas', 'map-marker-alt']} /> Kamalpokhari, Kathmandu</li>
              </ul>
            </div>

            {/* Social Icons */}
            <div className="flex flex-col items-center md:items-end justify-center gap-2">
              <h3 className="font-semibold text-gray-800 mb-2">Follow Us</h3>
              <div className="flex gap-4 text-3xl">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-600">
                  <FontAwesomeIcon icon={['fab', 'facebook']} className="text-black hover:text-blue-600" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-600">
                  <FontAwesomeIcon icon={['fab', 'instagram']} className="text-black hover:text-pink-600" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400">
                  <FontAwesomeIcon icon={['fab', 'x-twitter']} className="text-black hover:text-blue-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs mt-6 text-gray-500">
            © {new Date().getFullYear()} ChasmaPasal. All rights reserved.
          </div>
        </div>
      </footer>



    </div>
  );
}
