import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DoctorReviewForm from "@/components/DoctorReviewForm";

const DoctorReview = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);

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

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Our Specialist Doctors
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Share your experience and help others find the best eye care
          </p>
        </div>
        
        {userInfo?.role !== "doctor" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">
                Share Your Experience
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DoctorReviewForm setOpen={setOpen} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {doctors.map((doctor) => (
          <Link
            to={`/doctor-reviews/${doctor._id}`}
            key={doctor._id}
            className="transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Card className="overflow-hidden rounded-2xl shadow-lg dark:bg-gray-800 hover:shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
              <div className="relative h-56 w-full group">
                <img
                  src={doctor.image_url || "/images/altdoc.png"}
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  className="object-cover w-full h-full transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5 flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {doctor.specialization || "Ophthalmologist"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    View Reviews
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorReview;