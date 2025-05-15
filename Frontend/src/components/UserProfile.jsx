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
import { toast } from "react-hot-toast";

export default function UserProfile() {
  const baseUrl =  import.meta.env.VITE_APP_BASE_URL;
  const [appointments, setAppointments] = useState([]);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, [setUserInfo]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        let response;

        if (userInfo?.role === "admin") {
          response = await axios.get(`${baseUrl}/appointment`);
        } else {
          response = await axios.get(`${baseUrl}/appointment/${userInfo._id}`);
        }

        setAppointments(response.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo._id) {
      fetchAppointments();
    }
  }, [baseUrl, userInfo]);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <Badge variant="success">{status}</Badge>;
      case "cancelled":
        return <Badge variant="destructive">{status}</Badge>;
      case "pending":
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge>{status || "Unknown"}</Badge>;
    }
  };

  const clearPastAppointments = async () => {
    if (userInfo?.role !== "doctor") return;
    try {
      setIsClearing(true);
      const response = await axios.post(`${baseUrl}/appointment/clear/past`, {
        userId: userInfo._id,
      });

      if (response.data.success) {
        const now = new Date();
        setAppointments((prev) =>
          prev.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            const [hours, minutes] = appointment.time.split(":");
            appointmentDate.setHours(+hours);
            appointmentDate.setMinutes(+minutes);
            return appointmentDate >= now;
          })
        );
        toast.success("Past appointments cleared");
      }
    } catch (error) {
      console.error("Error clearing appointments:", error);
      toast.error("Failed to clear past appointments");
    } finally {
      setIsClearing(false);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (userInfo?.role !== "admin") return;
    try {
      await axios.delete(`${baseUrl}/appointment/${appointmentId}`);
      setAppointments((prev) =>
        prev.filter((app) => app._id !== appointmentId)
      );
      toast.success("Appointment deleted successfully");
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment");
    }
  };

  const hasPastAppointments = () => {
    const now = new Date();
    return appointments.some((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const [hours, minutes] = appointment.time.split(":");
      appointmentDate.setHours(+hours);
      appointmentDate.setMinutes(+minutes);
      return appointmentDate < now;
    });
  };

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Profile Card */}
        <Card className="shadow-xl rounded-xl border-0">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">

              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                  <img
                    alt="Profile"
                    src={userInfo?.image_url || "/default-avatar.png"}
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

              {/* Info */}
              <div className="flex-1 space-y-4 text-center lg:text-left w-full">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {userInfo?.firstName} {userInfo?.lastName}
                  </h1>
                  {userInfo?.role && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {userInfo.role}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                  {userInfo?.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5" />
                      <span>{userInfo.email}</span>
                    </div>
                  )}
                  {userInfo?.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <span>{userInfo.phone}</span>
                    </div>
                  )}
                  {userInfo?.address && (
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <MapPin className="w-5 h-5" />
                      <span>{userInfo.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-black text-white hover:bg-gray-400 hover:text-black" variant="outline">Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <UserProfileSetting setOpen={setOpen} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="shadow-xl rounded-xl border-0">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Appointments
              </h2>
              <div className="flex flex-wrap gap-2">
                {userInfo?.role === "doctor" && hasPastAppointments() && (
                  <Button
                    variant="outline"
                    onClick={clearPastAppointments}
                    disabled={loading || isClearing}
                  >
                    {isClearing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin mr-2" />
                        Clearing...
                      </>
                    ) : (
                      "Clear Past Appointments"
                    )}
                  </Button>
                )}
                {loading && !isClearing && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                    Loading...
                  </div>
                )}
              </div>
            </div>

            {appointments.length > 0 ? (
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                              {userInfo?.role === "admin" ? (
                                <>
                                  <p className="text-sm text-gray-500">Patient</p>
                                  <p className="font-medium">
                                    {appointment?.patient?.first_name
                                      ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                      : "Patient info unavailable"}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-2">Doctor</p>
                                  <p className="font-medium">
                                    {appointment?.doctor?.first_name
                                      ? `${appointment.doctor.first_name} ${appointment.doctor.last_name}`
                                      : "Doctor info unavailable"}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-gray-500">
                                    {userInfo?.role === "doctor" ? "Patient" : "Doctor"}
                                  </p>
                                  <p className="font-medium">
                                    {userInfo?.role === "doctor"
                                      ? appointment?.patient?.first_name
                                        ? `${appointment.patient.first_name} ${appointment.patient.last_name}`
                                        : "Patient info unavailable"
                                      : appointment?.doctor?.first_name
                                        ? `${appointment.doctor.first_name} ${appointment.doctor.last_name}`
                                        : "Doctor info unavailable"}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <CalendarDays className="w-5 h-5 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">Date</p>
                              <p className="font-medium">
                                {new Date(appointment.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                            {/* Time */}
                            <div className="flex items-start gap-3">
                              <Clock className="w-5 h-5 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm text-gray-500">Time</p>
                                <p className="font-medium">{appointment.time}</p>
                              </div>
                            </div>

                            {/* Status (aligned with Time) */}
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 mt-1" /> {/* Empty icon space for alignment */}
                              <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <div className="mt-1">{getStatusBadge(appointment.status)}</div>
                              </div>
                            </div>
                          </div>

                      <div className="flex justify-center items-center h-full">
                        {userInfo?.role === "admin" || userInfo?.role === "doctor" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteAppointment(appointment._id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>                  
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No appointments found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {userInfo?.role === "doctor"
                    ? "You don't have any upcoming appointments"
                    : "You haven't booked any appointments yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
