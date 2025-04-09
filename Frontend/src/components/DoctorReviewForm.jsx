import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "./ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { Textarea } from "./ui/textarea";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DoctorReviewForm = ({setOpen, id}) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  if (userInfo.role === "doctor") {
    navigate("/");
  }
  const [formData, setFormData] = useState({
    rating: "",
    review: "",
    doctorId: "",
    patientId: userInfo._id,
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/doctors`);
        setDoctors(response.data);
        if(id) {
          setSelectedDoctor(id);
          setFormData((prevData) => ({
            ...prevData,
            doctorId: id,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/review`, formData);
      toast.success("Review submitted successfully");
      setFormData({
        rating: "",
        review: "",
        doctorId: "",
        patientId: JSON.parse(localStorage.getItem("userInfo"))._id,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    }
  };
  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
    setFormData((prevData) => ({
      ...prevData,
      doctorId: value,
    }));
  };
  const handleChange = (e) => {
    if (e.target.name === 'rating') {
      const rating = parseInt(e.target.value);
      if (rating < 1 || rating > 5) {
        return;
      }
    }
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Add Review</CardTitle>
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
            <Label htmlFor="date">Rating</Label>
            <Input
              id="rating"
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Enter between 1 to 5"
              required
              min={1}
              max={5}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="time">Review</Label>
            <Textarea
              id="review"
              type="text"
              name="review"
              value={formData.review}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorReviewForm;
