import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardHeader,
  CardContent,
  Card,
  CardDescription,
} from "@/components/ui/card";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "@/context/UserContext";
import { X, UploadCloud, Image as ImageIcon } from "lucide-react";

const UserProfileSetting = ({ setOpen }) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const { userInfo, setUserInfo } = useContext(UserContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.match('image.*')) {
        toast.error("Please select an image file (JPEG, PNG, GIF)");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${baseUrl}/upload/users/${userInfo._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      toast.success("Profile picture updated successfully");
      const newUserInfo = { ...userInfo, image_url: res.data.image_url };
      localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      setUserInfo(newUserInfo);
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-white">Update Profile Picture</CardTitle>
            <CardDescription className="text-blue-100">Upload a new image for your profile</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-8">
            {/* Image Preview */}
            <div className="relative">
              <div className="w-36 h-36 rounded-full border-4 border-white dark:border-gray-800 shadow-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : userInfo.image_url ? (
                  <img
                    src={userInfo.image_url}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "";
                      e.target.parentElement.classList.add("flex", "items-center", "justify-center");
                    }}
                  />
                ) : (
                  <ImageIcon className="h-14 w-14 text-gray-400" />
                )}
              </div>

              {imageUrl && (
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <UploadCloud className="h-10 w-10 text-gray-400" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {file ? file.name : "Click to browse and upload"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={!file || isUploading}
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSetting;
