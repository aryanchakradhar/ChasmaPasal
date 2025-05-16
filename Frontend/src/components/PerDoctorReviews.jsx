import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import DoctorReviewForm from "./DoctorReviewForm";
import { toast } from "react-toastify";
import { Star,  Trash2, Edit, Save, X } from "lucide-react";
import { Textarea } from "./ui/textarea";

const PerDoctorReviews = () => {
  const { doctorId } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState({ text: "", rating: 0 });
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchDoctorReviews = async () => {
      try {
        const response = await axios.get(`${baseUrl}/review/${doctorId}`);
        setReviews(response.data);
        calculateAverageRating(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctorReviews();
  }, [open, editingReviewId]);

  const calculateAverageRating = (reviewsData) => {
    if (reviewsData.length === 0) {
      setAverageRating(0);
      return;
    }
    const totalRating = reviewsData.reduce((acc, curr) => acc + curr.rating, 0);
    const average = totalRating / reviewsData.length;
    setAverageRating(average.toFixed(1));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/review/${id}`);
      toast.success("Review deleted successfully");
      const updatedReviews = reviews.filter((review) => review._id !== id);
      setReviews(updatedReviews);
      calculateAverageRating(updatedReviews);
    } catch (error) {
      toast.error("Failed to delete review");
      console.error(error);
    }
  };

  const startEditing = (review) => {
    setEditingReviewId(review._id);
    setEditedReview({
      text: review.review,
      rating: review.rating
    });
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditedReview({ text: "", rating: 0 });
    setHoveredRating(0);
  };

  const handleEditChange = (e) => {
    setEditedReview({ ...editedReview, text: e.target.value });
  };

  const handleRatingChange = (newRating) => {
    setEditedReview({ ...editedReview, rating: newRating });
  };

  const saveEditedReview = async () => {
    try {
      const response = await axios.put(
        `${baseUrl}/review/${editingReviewId}`,
        {
          review: editedReview.text,
          rating: editedReview.rating
        }
      );
      
      const updatedReviews = reviews.map(review => 
        review._id === editingReviewId ? response.data : review
      );
      
      setReviews(updatedReviews);
      calculateAverageRating(updatedReviews);
      toast.success("Review updated successfully");
      cancelEditing();
    } catch (error) {
      toast.error("Failed to update review");
      console.error(error);
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    const displayRating = interactive && hoveredRating ? hoveredRating : rating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`${interactive ? "cursor-pointer" : "cursor-default"}`}
          onClick={() => interactive && handleRatingChange(i)}
          onMouseEnter={() => interactive && setHoveredRating(i)}
          onMouseLeave={() => interactive && setHoveredRating(0)}
        >
          {i <= displayRating ? (
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="w-5 h-5 text-gray-300" />
          )}
        </button>
      );
    }
    return stars;
  };

  const getRatingDescription = (rating) => {
    const descriptions = {
      5: "Exceptional",
      4: "Very Good",
      3: "Average",
      2: "Below Average",
      1: "Poor"
    };
    return descriptions[Math.round(rating)] || "";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Patient Feedback
            </h1>
            {reviews.length > 0 ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(averageRating)}
                  </div>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {averageRating} out of 5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                  <span className="text-black-600 dark:text-black-400 font-medium">
                    {getRatingDescription(averageRating)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No reviews yet
              </p>
            )}
          </div>
          
          {userInfo.role !== "doctor" && userInfo.role !== "admin" &&(
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap bg-black text-white  hover:bg-gray-400 hover:text-black hover:border-black">
                  Share Your Experience
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DoctorReviewForm setOpen={setOpen} id={doctorId} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {reviews.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              About Dr. {reviews[0]?.doctor.first_name} {reviews[0]?.doctor.last_name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {reviews[0]?.doctor.specialization || "Specialized physician"} 
            </p>
          </div>
        )}

        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div 
                key={review._id}
                className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
              >
                {editingReviewId === review._id ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {review.patient.first_name} {review.patient.last_name}
                      </h3>
                      <div className="flex gap-2 self-end sm:self-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEditing}
                          className="flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveEditedReview}
                          className="flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(editedReview.rating, true)}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {editedReview.rating.toFixed(1)} - {getRatingDescription(editedReview.rating)}
                      </span>
                    </div>
                    <Textarea
                      value={editedReview.text}
                      onChange={handleEditChange}
                      className="min-h-[100px] mt-2"
                      placeholder="Share your experience..."
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {review.patient.first_name} {review.patient.last_name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="flex mr-2">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {review.rating.toFixed(1)} - {getRatingDescription(review.rating)}
                          </span>
                        </div>
                      </div>
                      {userInfo._id === review.patient._id && (
                        <div className="flex gap-2 self-end sm:self-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(review)}
                            className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(review._id)}
                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {review.review}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {review.updatedAt !== review.createdAt && (
                        <span className="ml-2 italic">(edited)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No patient feedback yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Be the first to share your experience with this doctor.
              </p>
              {userInfo.role === "user" && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-gray-400 hover:text-black hover:border-black">
                      Write the First Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DoctorReviewForm setOpen={setOpen} id={doctorId} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerDoctorReviews;