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
    <div className="container mt-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl"> Doctor Reviews</h1>
        {userInfo.role !== "doctor" && (
          <div className="ml-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Add Reviews</Button>
              </DialogTrigger>
              <DialogContent>
                <DoctorReviewForm />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <div className="container mt-24">
        {doctors.map((doctor) => {
          return (
            <Link to={`/doctor-reviews/${doctor._id}`} key={doctor._id}>
              <Card className="p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 transition-transform duration-500 ease-in-out transform hover:scale-105 hover:z-50 shadow-lg">
                <div className="relative">
                  <a className="block relative h-48 rounded overflow-hidden">
                    <img
                      alt="doctor"
                      className="object-cover object-center w-full h-full block"
                      src={
                       doctor.image_url
                      }
                    />
                  </a>
                </div>
                <div className="mt-4 flex flex-row justify-between">
                  <div>
                    <h2 className="text-gray-900 title-font text-sm font-medium dark:text-white">
                      {doctor.first_name} {doctor.last_name}
                    </h2>
                  </div>
                  <div></div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DoctorReview;
