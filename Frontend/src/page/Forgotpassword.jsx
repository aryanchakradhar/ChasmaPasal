import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${baseUrl}/user/send-reset-otp`, { email: resetEmail });
      if (data.success) {
        toast.success("OTP sent to your email.");
        setShowResetForm(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${baseUrl}/user/reset-password`, {
        email: resetEmail,
        otp,
        newPassword,
      });

      if (data.success) {
        toast.success("Password reset successfully");
        navigate("/login"); // Redirect to login page after password reset
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
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
            <CardTitle className="text-xl">{showResetForm ? "Reset Password" : "Forgot Password"}</CardTitle>
            <CardDescription>
              {showResetForm
                ? "Enter the OTP sent to your email and your new password"
                : "Enter your email to receive a password reset OTP"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!showResetForm ? (
              <form onSubmit={handleEmailSubmit} className="grid gap-4">
                <div className="grid gap-2 text-left">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Send OTP</Button>
              </form>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="grid gap-4">
                <div className="grid gap-2 text-left">
                  <Label htmlFor="reset-otp">OTP</Label>
                  <Input
                    id="reset-otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                  />
                </div>
                <div className="grid gap-2 text-left">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Reset Password</Button>
              </form>
            )}

            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link to="/login" className="underline text-black">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
