import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
 
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default function Login() {
  const baseUrl =  import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  // To check if the user is already logged in
  useEffect(() => {
    const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (UserInfo?.token) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/user/login`, formData);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data.error ||
          "Failed to Login! Please check credentials"
      );
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 lg:gap-x-8">
      <div className="lg:flex justify-center items-center h-full hidden">
        <div>
          <img
            src="/images/Logo.png"
            alt="Logo"
            width="450"
            height="310"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex items-center justify-center h-full bg-gray-100">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="grid gap-4 w-72">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-left">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="m@example.com"
                  required
                />
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="password" className="text-left">Password</Label>
                <Input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                />
             
              </div>

              <div className="flex justify-between gap-2 lg:flex text-sm mt-4">
                
                <Link to="/forgotpassword" className="underline text-black hover:text-gray-400">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="underline text-black hover:text-gray-400">
                Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
