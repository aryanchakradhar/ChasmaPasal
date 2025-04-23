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
      toast.success("Successful added Doctor");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="">
     
     <div className="flex items-center justify-center min-h-screen bg-muted px-4">
        <Tabs defaultValue="doctor" className="w-full max-w-md">
          <TabsList className="flex justify-center">
            {UserInfo.role === "admin" && (
              <TabsTrigger value="doctor">Doctor Registration</TabsTrigger>
            )}
          </TabsList>

          {UserInfo.role === "admin" && (
            <TabsContent value="doctor">
              <Card className="w-full shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center font-semibold">
                    Doctor Sign Up
                  </CardTitle>
                  <CardDescription className="text-center">
                    Fill out the form below to create a new doctor account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => handleSignUp(e, "doctor")}
                    className="grid gap-5"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="first-name">First name</Label>
                        <Input
                          value={formData.firstName}
                          name="firstName"
                          onChange={handleChange}
                          id="first-name"
                          placeholder="Max"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="last-name">Last name</Label>
                        <Input
                          value={formData.lastName}
                          onChange={handleChange}
                          id="last-name"
                          name="lastName"
                          placeholder="Robinson"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="medical-license">Medical License</Label>
                      <Input
                        id="medical-license"
                        placeholder="123xxxxx"
                        onChange={handleChange}
                        name="medicalLicense"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="Retina"
                        onChange={handleChange}
                        name="specialization"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        onChange={handleChange}
                        name="email"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        onChange={handleChange}
                        name="password"
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirm_password">Confirm Password</Label>
                      <Input
                        id="confirm_password"
                        type="password"
                        onChange={handleChange}
                        name="confirmPassword"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 transition-all text-white font-medium rounded-lg"
                    >
                      Create an Account
                    </Button>
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