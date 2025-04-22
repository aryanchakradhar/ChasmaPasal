import DoctorReviewForm from "@/components/DoctorReviewForm";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DoctorReview = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [doctors, setDoctors] = useState([]);

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
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Doctor Reviews
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <Link
            to={`/doctor-reviews/${doctor._id}`}
            key={doctor._id}
            className="transition duration-300 transform hover:scale-105"
          >
            <Card className="overflow-hidden rounded-2xl shadow-lg dark:bg-gray-800 hover:shadow-xl">
              <div className="relative h-48 w-full">
                <img
                  src={doctor.image_url}
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {doctor.first_name} {doctor.last_name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tap to review this doctor
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DoctorReview;
