import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import DoctorReviewForm from "./DoctorReviewForm";
import { toast } from "react-toastify";

const PerDoctorReviews = () => {
  const { doctorId } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchDoctorReviews = async () => {
      try {
        const response = await axios.get(`${baseUrl}/review/${doctorId}`);
        setReviews(response.data);
        const totalRating = response.data.reduce(
          (acc, curr) => acc + curr.rating,
          0
        );
        const average = totalRating / response.data.length;
        setAverageRating(average.toFixed(2));
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctorReviews();
  }, [open]);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/review/${id}`);
      toast.success("Review deleted successfully");
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 mt-4 px-6 text-left dark:text-white">
          Doctor Reviews
        </h1>
        {userInfo.role !== "doctor" && (
          <div className="ml-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Add Reviews</Button>
              </DialogTrigger>
              <DialogContent>
                <DoctorReviewForm setOpen={setOpen} id={doctorId} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <div className="mt-4 px-6 py-3 text-left">
        <div className="flex gap-4 flex-col mb-2">
          <h2 className="text-left">
            Doctor Name: {reviews[0]?.doctor.first_name}{" "}
            {reviews[0]?.doctor.last_name}
          </h2>
          <h2>Average Rating: {averageRating}</h2>
        </div>
        <hr />
        <table className="min-w-full divide-y mt-4 divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                Review
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">
                
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {reviews.map((review) => {
              return (
                <tr key={review._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {review.patient.first_name} {review.patient.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {review.rating}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {review.review}
                  </td>
                  {userInfo._id === review.patient._id? (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                      <Button
                        onClick={() => handleDelete(review._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  ):
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-gray-200">
                    </td>
                  }
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerDoctorReviews;
