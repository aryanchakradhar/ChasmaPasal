import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function SignUp() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    if (UserInfo?.token) {
      navigate("/");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    medicalLicense: "",
    specialization: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e, role) => {
    e.preventDefault();
    let data = { ...formData };
    if (role === "doctor") {
      data.role = "doctor";
    }
    try {
      const response = await axios.post(`${baseUrl}/user/register`, data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      toast.success("Signup Successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
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
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="grid gap-4">
                
                    <div className="grid gap-2 text-left" >
                      <Label htmlFor="first-name">First name</Label>
                      <Input
                        value={formData.firstName}
                        onChange={handleChange}
                        id="first-name"
                        name="firstName"
                        placeholder="Aryan"
                        required
                      />
                    </div>
                    <div className="grid gap-2 text-left">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input
                        value={formData.lastName}
                        onChange={handleChange}
                        id="last-name"
                        name="lastName"
                        placeholder="Chakradhar"
                        required
                      />
                    </div>
                  <div className="grid gap-2 text-left">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2 text-left">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      value={formData.password}
                      onChange={handleChange}
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="grid gap-2 text-left">
                    <Label htmlFor="confirm_password">Confirm password</Label>
                    <Input
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      id="confirm_password"
                      name="confirmPassword"
                      type="password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create an account
                  </Button>
                </form>
                <div class="relative flex py-5 items-center">
                    <div class="flex-grow border-t border-gray-400"></div>
                    <span class="flex-shrink mx-4 text-gray-400">or</span>
                    <div class="flex-grow border-t border-gray-400"></div>
                </div>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline text-black">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
      
      </div>
    </div>
  );
}
