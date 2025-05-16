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
import { Star, StarHalf } from "lucide-react";

const DoctorReviewForm = ({ setOpen, id }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  if (userInfo.role === "doctor") {
    navigate("/");
  }

  const [formData, setFormData] = useState({
    rating: 0,
    review: "",
    doctorId: id || "",
    patientId: userInfo._id,
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(id || "");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseUrl =  import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/doctors`);
        setDoctors(response.data);
        if (id) {
          setSelectedDoctor(id);
          setFormData((prevData) => ({
            ...prevData,
            doctorId: id,
          }));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`${baseUrl}/review`, formData);
      toast.success("Review submitted successfully");
      setFormData({
        rating: 0,
        review: "",
        doctorId: id || "",
        patientId: userInfo._id,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDoctorChange = (value) => {
    setSelectedDoctor(value);
    setFormData((prevData) => ({
      ...prevData,
      doctorId: value,
    }));
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className="focus:outline-none"
        onClick={() => setFormData({ ...formData, rating: star })}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
      >
        {star <= (hoverRating || formData.rating) ? (
          <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
        ) : (
          <Star className="w-8 h-8 text-gray-300" />
        )}
      </button>
    ));
  };

  const getRatingDescription = (rating) => {
    const descriptions = {
      5: "Exceptional",
      4: "Very Good",
      3: "Average",
      2: "Below Average",
      1: "Poor"
    };
    return descriptions[rating] || "Select rating";
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-0 shadow-lg overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white ">
          Share Your Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {!id && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 ">
                Select Doctor
              </Label>
              <Select 
                onValueChange={handleDoctorChange} 
                value={selectedDoctor}
                required
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem 
                      key={doctor._id} 
                      value={doctor._id}
                      className="py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{doctor.first_name} {doctor.last_name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doctor.specialization || "General Physician"}
                          </p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Rating
              </Label>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {renderStars()}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {getRatingDescription(formData.rating)}
                </span>
              </div>
              <input
                type="hidden"
                name="rating"
                value={formData.rating}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Review
              </Label>
              <Textarea
                className="min-h-[120px]"
                name="review"
                value={formData.review}
                onChange={handleReviewChange}
                placeholder="Share details about your experience..."
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your honest feedback helps others make better decisions.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DoctorReviewForm;