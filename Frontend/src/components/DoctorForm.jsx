import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AddDoctorForm() {
  const baseUrl =  import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo?.role !== "admin") {
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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const payload = { ...formData, role: "doctor" };
      const { data } = await axios.post(`${baseUrl}/user/register`, payload);
      toast.success("Doctor registered. OTP sent to email.");
      setUserId(data._id);
      await axios.post(`${baseUrl}/user/send-verify-otp`, { userId: data._id });
      setShowOtpForm(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${baseUrl}/user/verify-email`, { userId, otp });
      if (data.success) {
        toast.success("Doctor verified successfully");
        navigate("/");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`${baseUrl}/user/send-verify-otp`, { userId });
      toast.info("OTP resent to email");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <Card className="shadow-lg border-0 rounded-xl">
        <CardHeader className="bg-black text-white text-center rounded-t-xl">
          <CardTitle className="text-2xl">
            {showOtpForm ? "Verify Doctor Email" : "Add New Doctor"}
          </CardTitle>
          <CardDescription>
            {showOtpForm
              ? "Enter the OTP sent to the doctor’s email address"
              : "Fill in the required information to add a doctor"}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {!showOtpForm ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="medicalLicense">Medical License</Label>
                <Input
                  id="medicalLicense"
                  name="medicalLicense"
                  value={formData.medicalLicense}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-400 hover:border-black">
                Register Doctor
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
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

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Verify Email
              </Button>

              <p className="text-center text-sm text-gray-600">
                Didn’t receive OTP?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={handleResendOtp}
                >
                  Resend
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
