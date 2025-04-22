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
} from "@/components/ui/select";
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  // Fetch doctors list
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch available slots for a selected doctor and date
  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      const res = await axios.get(`${baseUrl}/appointment/available/slots`, {
        params: { doctorId, date },
      });
      setAvailableSlots(res.data.data.availableSlots || []);
      setAllSlots(res.data.data.allSlots || []);      
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load available slots");
    }
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "date" && formData.doctorId) {
      fetchAvailableSlots(formData.doctorId, value);
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
    const updatedFormData = { ...formData, doctorId: value === "none" ? "" : value };
    setFormData(updatedFormData);

    if (value !== "none" && formData.date) {
      fetchAvailableSlots(value, formData.date);
    } else {
      setAvailableSlots([]);
      setAllSlots([]);
    }
  };

  // Handle time slot selection
  const handleSlotChange = (value) => {
    console.log("Selected Slot:", value); 
    setFormData((prevData) => ({ ...prevData, time: value }));
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.time) {
      return toast.warning("Please select a doctor and an available time slot");
    }
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return toast.warning("Please select a date in the future");
    }
  

    try {
      const res = await axios.post(`${baseUrl}/appointment/`, formData);
      if (res.data.status === 400) {
        toast.error(res.data.message);
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
        setAvailableSlots([]);
        setAllSlots([]);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Failed to Book Appointment");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen flex-col-reverse lg:flex-row gap-x-10 bg-gray-50 dark:bg-black p-4 lg:p-8">
      <div className="max-w-lg w-full lg:w-1/2">
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              {headerText}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-6">
              {/* Doctor selection */}
              <div className="grid gap-4">
                <Label htmlFor="doctor">Select Doctor</Label>
                <Select onValueChange={handleDoctorChange} value={selectedDoctor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="none" value="none">
                      None
                    </SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id}>
                        {doctor.first_name} {doctor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date selection */}
              <div className="grid gap-4">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Available time slots */}
              <div className="grid gap-4">
                <Label htmlFor="time">Available Slots</Label>
                <Select 
                  onValueChange={(value) => setFormData(prev => ({...prev, time: value }))}
                  value={formData.time}
                  disabled={!availableSlots.length}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableSlots.length ? "Select Time Slot" : "No slots available"} />
                  </SelectTrigger>
                  <SelectContent>
                    {allSlots.map((slot) => (
                      <SelectItem 
                        key={slot} 
                        value={slot} 
                        disabled={!availableSlots.includes(slot)}
                      >
                        {slot} - {String(Number(slot.split(":")[0]) + 1)}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Contact input */}
              <div className="grid gap-4">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  type="text"
                  name="contact"
                  placeholder="9862757595"
                  value={formData.contact}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  required
                  className="focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 hover:text-white text-white rounded-md py-3 mt-4"
              >
                Book Now
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-1/3 h-full flex justify-center items-center">
        <img
          src="/images/Appointment.jpeg"
          alt="Appointment"
          className="object-cover w-full h-[80vh] rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AppointmentForm;
