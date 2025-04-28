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
import { Eye, EyeOff } from "lucide-react";

export function AddDoctor() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {
    if (UserInfo?.role != "admin") {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUp = async (e, role) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    let data = { ...formData };
    if (role === "doctor") {
      data.role = "doctor";
    }
  
    try {
      const response = await axios.post(`${baseUrl}/user/register`, data);
      toast.success("Successfully added Doctor");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="doctor" className="w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Doctor</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Register a new doctor to your healthcare system
          </p>
        </div>

        {UserInfo.role === "admin" && (
            <TabsContent value="doctor">
              <Card className="w-full shadow-lg rounded-xl overflow-hidden border-0">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-black dark:from-gray-600 dark:to-black p-6">
                  <CardTitle className="text-2xl font-bold text-white text-center">
                    Doctor Registration
                  </CardTitle>
                  <CardDescription className="text-blue-100 dark:text-blue-200 text-center">
                    Please fill in all required details
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8">
                  <form
                    onSubmit={(e) => handleSignUp(e, "doctor")}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-gray-700 dark:text-gray-300">
                          First Name *
                        </Label>
                        <Input
                          value={formData.firstName}
                          name="firstName"
                          onChange={handleChange}
                          id="first-name"
                          placeholder="John"
                          required
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-gray-700 dark:text-gray-300">
                          Last Name *
                        </Label>
                        <Input
                          value={formData.lastName}
                          onChange={handleChange}
                          id="last-name"
                          name="lastName"
                          placeholder="Doe"
                          required
                          className="focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medical-license" className="text-gray-700 dark:text-gray-300">
                        Medical License Number *
                      </Label>
                      <Input
                        id="medical-license"
                        placeholder="12345678"
                        onChange={handleChange}
                        name="medicalLicense"
                        required
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-gray-700 dark:text-gray-300">
                        Specialization *
                      </Label>
                      <Input
                        id="specialization"
                        placeholder="ophthalmologists, optometrists, and opticians"
                        onChange={handleChange}
                        name="specialization"
                        required
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@example.com"
                        onChange={handleChange}
                        name="email"
                        required
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                        Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          onChange={handleChange}
                          name="password"
                          required
                          className="pr-10 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password" className="text-gray-700 dark:text-gray-300">
                        Confirm Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          onChange={handleChange}
                          name="confirmPassword"
                          required
                          className="pr-10 focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>


                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full py-6 bg-black hover:bg-gray-700 text-white font-medium shadow-md transition-all"
                      >
                        Register Doctor
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

