import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CircleUser, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!UserInfo) {
      navigate("/login");
    }
    setUserData(UserInfo);
  }, [navigate]);

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
          {userData.role !== "doctor" && <Link to="/" className={location.pathname === "/" ? "text-primary" : "text-muted-foreground"}>Home</Link>}
          <Link to="/products" className={location.pathname === "/products" ? "text-primary" : "text-muted-foreground"}>AR Glasses</Link>
          {userData.role !== "doctor" && <Link to="/AppointmentForm" className={location.pathname === "/AppointmentForm" ? "text-primary" : "text-muted-foreground"}>Appointments</Link>}
          <Link to="/doctor-reviews" className={location.pathname === "/doctor-reviews" ? "text-primary" : "text-muted-foreground"}>Reviews</Link>
          {userData.role === "Admin" &&<Link to="/orders" className={location.pathname === "/orders" ? "text-primary" : "text-muted-foreground"}>Orders</Link>}
          <Link to="/aboutus" className={location.pathname === "/about" ? "text-primary" : "text-muted-foreground"}>About Us</Link>
        </nav>
        
        {/* Actions */}
        <div className="flex items-center gap-10">
          <form className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-64 bg-background pl-8" />
          </form>
          
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-mainbg p-0 mr-5">
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
    </div>
  );
}
