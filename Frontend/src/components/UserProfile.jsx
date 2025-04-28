import { CardContent, Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserProfileSetting from "./UserProfileSetting";
import { Button } from "./ui/button";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { Badge } from "./ui/badge";
import { CalendarDays, Clock, User, MapPin, Phone, Mail } from "lucide-react";

export default function UserProfile() {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const [appointments, setAppointments] = useState([]);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, [setUserInfo]);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      const fetchAppointments = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${baseUrl}/appointment/${userInfo._id}`);
          setAppointments(response.data.data || []);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, [baseUrl, userInfo]);

  const getStatusBadge = (status) => {
    if (!status) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="success">{status}</Badge>;
      case "cancelled":
        return <Badge variant="destructive">{status}</Badge>;
      case "pending":
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-4 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Profile Card */}
        <Card className="shadow-xl rounded-xl border-0 overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                  <img
                    alt="Profile"
                    src={userInfo.image_url || "/default-avatar.png"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-white bg-black bg-opacity-50 hover:bg-opacity-70"
                      >
                        Edit Photo
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4 text-center lg:text-left">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {userInfo.firstName} {userInfo.lastName}
                  </h1>
                  {userInfo.role && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                      {userInfo.role}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userInfo.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{userInfo.email}</span>
                    </div>
                  )}
                  {userInfo.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{userInfo.phone}</span>
                    </div>
                  )}
                  {userInfo.address && (
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{userInfo.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600"
                    >
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <UserProfileSetting setOpen={setOpen} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Section */}
        <div className="mt-10">
          <Card className="shadow-xl rounded-xl border-0">
            <CardContent className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Appointments
                </h2>
                {loading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                    Loading...
                  </div>
                )}
              </div>

              {appointments.length > 0 ? (
                <div className="grid gap-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {userInfo.role === "doctor" ? "Patient" : "Doctor"}
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {userInfo.role === "doctor" 
                                    ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                    : `${appointment.doctor.first_name} ${appointment.doctor.last_name}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <CalendarDays className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {new Date(appointment.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {appointment.time}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                <div className="mt-1">
                                  {getStatusBadge(appointment.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No appointments found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {userInfo.role === "doctor" 
                      ? "You don't have any upcoming appointments"
                      : "You haven't booked any appointments yet"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}