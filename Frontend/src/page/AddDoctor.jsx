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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export function AddDoctor() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const UserInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (UserInfo?.role !== "admin") {
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const data = { ...formData, role: "doctor" };

    try {
      const response = await axios.post(`${baseUrl}/user/register`, data);
      toast.success("Doctor registered. OTP sent to email.");
      setUserId(response.data._id);

      await axios.post(`${baseUrl}/user/send-verify-otp`, { userId: response.data._id });
      setShowOtpForm(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering doctor");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseUrl}/user/verify-email`, { userId, otp });
      if (data.success) {
        toast.success("Doctor email verified successfully.");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${baseUrl}/user/send-verify-otp`, { userId });
      toast.info("OTP resent to email.");
    } catch (error) {
      toast.error("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="doctor" className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Doctor</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Register a new doctor</p>
          </div>

          <TabsContent value="doctor">
            <Card className="w-full shadow-lg rounded-xl overflow-hidden border-0">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-black p-6">
                <CardTitle className="text-2xl font-bold text-white text-center">
                  {showOtpForm ? "Verify Doctor Email" : "Doctor Registration"}
                </CardTitle>
                <CardDescription className="text-blue-100 text-center">
                  {showOtpForm ? "Enter the OTP sent to the email address" : "Please fill in all required details"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                {!showOtpForm ? (
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name *</Label>
                        <Input
                          id="first-name"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name *</Label>
                        <Input
                          id="last-name"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalLicense">Medical License Number *</Label>
                      <Input
                        id="medicalLicense"
                        name="medicalLicense"
                        value={formData.medicalLicense}
                        onChange={handleChange}
                        placeholder="12345678"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization *</Label>
                      <Input
                        id="specialization"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="Ophthalmologist, Optometrist, etc."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="doctor@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button type="submit" className="w-full py-6 bg-black hover:bg-gray-700 text-white font-medium">
                        Register Doctor
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP sent to email"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                      Verify Email
                    </Button>

                    <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-2">
                      Didn't receive OTP?{" "}
                      <button type="button" className="text-blue-600 hover:underline" onClick={handleResendOtp}>
                        Resend
                      </button>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
