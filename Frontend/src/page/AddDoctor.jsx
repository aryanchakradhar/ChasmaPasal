import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import DoctorForm from "@/components/DoctorForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const navigate = useNavigate();
  const baseUrl =   import.meta.env.VITE_APP_BASE_URL;

  const [doctors, setDoctors] = useState([]);
  const [openAddDoctor, setOpenAddDoctor] = useState(false);

  const getDoctors = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/doctors`);
      setDoctors(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch doctors");
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.role !== "admin") {
      navigate("/");
    }
    getDoctors();
  }, [baseUrl, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/user/doctor/${id}`);
      toast.success("Doctor deleted successfully");
      getDoctors();
    } catch (error) {
      console.error(error);
      toast.error("Doctor deletion failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Doctors</h1>
        <Dialog open={openAddDoctor} onOpenChange={setOpenAddDoctor}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-black text-white px-4 py-2 rounded-md shadow hover:bg-gray-400 hover:text-black text-sm"
            >
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DoctorForm setOpen={setOpenAddDoctor} getDoctors={getDoctors} />
          </DialogContent>
        </Dialog>
      </div>

      <Table className="shadow-lg rounded-lg bg-white overflow-hidden">
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Medical License</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id} className="hover:bg-gray-50 transition-all">
              <TableCell className="font-medium">
                {doctor.first_name} {doctor.last_name}
              </TableCell>
              <TableCell>{doctor.email}</TableCell>
              <TableCell>{doctor.specialization || "-"}</TableCell>
              <TableCell>{doctor.medicalLicense || "-"}</TableCell>
              <TableCell className="text-center">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="outline"
                      className="bg-red-500 text-white hover:bg-red-600 px-6 py-2"
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the doctor.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(doctor._id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AddDoctor;
