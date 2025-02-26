import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "react-toastify";

const AppointmentForm = ({ headerText }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    contact: "",
    patientId: userInfo._id,
    doctorId: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
    setFormData((prevData) => ({
      ...prevData,
      doctorId: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/appointment/`, formData);
      if (res.data.status == 400) {
        toast(res.data.message);
      } else {
        toast.success("Appointment Booked Successfully");
        setFormData({
          date: "",
          time: "",
          contact: "",
          patientId: userInfo._id,
          doctorId: "",
        });
        setSelectedDoctor("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Book Appointment");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col-reverse lg:flex-row gap-x-10">
      {/* Form Section */}
      <div className="max-w-lg w-full lg:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{headerText}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select onValueChange={handleDoctorChange} value={selectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        {doctor.first_name} {doctor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  type="text"
                  name="contact"
                  placeholder="9862757595"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Book Now
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Image Section */}
      <div className="w-full lg:w-1/3 h-full flex justify-center items-center">
        <img
          src="/images/Appointment.jpeg"
          alt="Appointment"
          className="object-cover w-full h-[80vh]" 
        />
      </div>
    </div>
  );
};

export default AppointmentForm;
