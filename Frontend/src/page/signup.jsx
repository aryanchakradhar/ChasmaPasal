import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Signup() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  // State variables
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.token) {
      navigate("/");
    }
  }, [navigate]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const { data } = await axios.post(`${baseUrl}/user/register`, formData);
      console.log(data);
      toast.success("Account created. Please verify your email.");
      setUserId(data._id);

      // Send OTP for email verification
      await axios.post(`${baseUrl}/user/send-verify-otp`, { userId: data._id });

      setShowOtpForm(true);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  // Handle OTP form submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${baseUrl}/user/verify-email`, { userId, otp });

      if (data.success) {
        toast.success("Email verified successfully");
        const loginResponse = await axios.post(`${baseUrl}/user/login`, {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("userInfo", JSON.stringify(loginResponse.data));
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2 lg:gap-x-8">
      <div className="lg:flex justify-center items-center h-full hidden">
        <img src="/images/Logo.png" alt="Logo" width="450" height="310" className="object-cover" />
      </div>

      <div className="flex items-center justify-center h-full bg-gray-100">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-xl">{showOtpForm ? "Verify OTP" : "Sign Up"}</CardTitle>
            <CardDescription>
              {showOtpForm ? "Enter the OTP sent to your email" : "Enter your information to create an account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Conditional rendering for sign-up and OTP form */}
            {!showOtpForm ? (
              <form onSubmit={handleSignUp} className="grid gap-4">
                <div className="grid gap-2 text-left">
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
                <Button type="submit" className="w-full">Create an account</Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="grid gap-4">
                <div className="grid gap-2 text-left">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Verify Email</Button>
              </form>
            )}

            {/* Links for alternative actions */}
            {!showOtpForm && (
              <>
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="flex-shrink mx-4 text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>
                <Button variant="outline" className="w-full">Sign up with Google</Button>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline text-black">Sign in</Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
