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

const UserProfileSetting = ({setOpen}) => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const { userInfo, setUserInfo } = useContext(UserContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result); // Set uploaded image URL to state
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`${baseUrl}/upload/users/${userInfo._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then((res) => {
        toast.success("Image uploaded successfully");
        console.log(res);
        const newUserInfo = { ...userInfo, image_url: res.data.image_url };
        console.log(newUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(newUserInfo));
        setUserInfo(newUserInfo);
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };
  return (
    <Card className="mt-3">
      <CardHeader>
        <CardTitle>User Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex items-center space-x-5">
          <Card className="w-full max-w-lg">
            <CardHeader className="pb-0">
              <CardTitle>Upload Photo</CardTitle>
              <CardDescription CardDescription>
                Accepted file types: .png, .jpg, .gif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 relative overflow-hidden rounded-lg">
                  {imageUrl ? (
                    <img
                      alt="Preview"
                      src={imageUrl}
                      style={{
                        aspectRatio: "100/100",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      alt="Preview"
                      height="100"
                      src={userInfo.image_url}
                      style={{
                        aspectRatio: "100/100",
                        objectFit: "cover",
                      }}
                      width="100"
                    />
                  )}
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-2 text-sm mt-2"
                >
                  <div className="relative inline-block w-64">
                    <input
                      accept=".png, .jpg, .gif, .jpeg"
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0"
                    />
                    <label
                      htmlFor="file"
                      className="flex justify-center items-center space-x-2 px-4 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <span>Choose File</span>
                    </label>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <Button>Upload</Button>
                    {/* <Button variant="outline">Remove Image</Button> */}
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileSetting;
