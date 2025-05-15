import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl =  import.meta.env.BACKEND_BASE_URL ||  import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${baseUrl}/user/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to load doctors");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const fetchAvailableSlots = async (doctorId, date) => {
    if (!doctorId || !date) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`${baseUrl}/appointment/available/slots`, {
        params: { doctorId, date },
      });
      setAvailableSlots(res.data.data.availableSlots || []);
      setAllSlots(res.data.data.allSlots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to load available slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === "date" && formData.doctorId) {
      fetchAvailableSlots(formData.doctorId, value);
    }
  };

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
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white dark:bg-black">

      {/* Banner */}
      <div className="relative w-full h-[400px] md:h-[300px] overflow-clip">
        <img
          src="/images/doctors.jpg"
          alt="Eye Checkup Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Eye Checkup Appointment Booking
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            Experience exceptional eye care with ChasmaPasal – Book your eye checkup appointment today and see the world with clarity!
          </p>
        </div>
      </div>

      {/* Form */}

      <div className="w-full max-w-2xl mx-auto p-4 lg:p-8 mt-5 mb-5">

      <Card className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
          <CardHeader className="p-6 relative z-10">
            <CardTitle className="text-2xl font-bold text-black dark:text-white">
              {headerText || "Book Your Appointment"}
            </CardTitle>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Schedule your eye examination with our specialists
            </p>
          </CardHeader>

          <CardContent className="p-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Doctor Select */}
              <div className="space-y-2">
                <Label htmlFor="doctor" className="text-gray-700 dark:text-gray-300 font-medium">
                  Select Doctor
                </Label>
                <Select onValueChange={handleDoctorChange} value={selectedDoctor}>
                  <SelectTrigger className="h-12 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black hover:border-black transition-all">
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <SelectItem value="none" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      Select a doctor
                    </SelectItem>
                    {doctors.map((doctor) => (
                      <SelectItem
                        key={doctor._id}
                        value={doctor._id}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Dr. {doctor.first_name} {doctor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 font-medium">
                  Appointment Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="h-12 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black hover:border-black transition-all"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300 font-medium">
                  Available Time Slots
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {allSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={
                        formData.time === slot
                          ? "default"
                          : availableSlots.includes(slot)
                          ? "outline"
                          : "ghost"
                      }
                      disabled={!availableSlots.includes(slot)}
                      onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                      className={`h-10 ${
                        !availableSlots.includes(slot)
                          ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "border border-gray-300 hover:border-black transition-all"
                      }`}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                {allSlots.length === 0 && formData.date && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No slots available for this date
                  </p>
                )}
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-gray-700 dark:text-gray-300 font-medium">
                  Contact Number
                </Label>
                <Input
                  id="contact"
                  type="tel"
                  name="contact"
                  placeholder="98XXXXXXXX"
                  value={formData.contact}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  inputMode="numeric"
                  required
                  className="h-12 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-black hover:border-black transition-all"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-white text-white hover:text-black border border-black hover:border-gray-300 transition-all rounded-lg shadow-md mt-4 disabled:opacity-60"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Booking...
                  </>
                ) : (
                  "Confirm Appointment"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentForm;
