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

import ProductForm from "@/components/ProductForm";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { ProductContext } from "@/context/ProductContext";

const AddProducts = () => {
  const navigate = useNavigate();
  const { products, setProducts } = useContext(ProductContext);
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  const [openAddProduct, setOpenProduct] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const getProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.role !== "admin") {
      navigate("/");
    }
    getProducts();
  }, [baseUrl, navigate, setProducts]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/products/${id}`);
      toast.success("Product deleted successfully");
      getProducts();
    } catch (error) {
      console.error(error);
      toast.error("Product deletion failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
        <Dialog open={openAddProduct} onOpenChange={setOpenProduct}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-black hover:text-white text-sm"
            >
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ProductForm setOpen={setOpenProduct} getProducts={getProducts} />
          </DialogContent>
        </Dialog>
      </div>

      <Table className="shadow-lg rounded-lg bg-white overflow-hidden">
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Brand</TableHead>
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Created At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id} className="hover:bg-gray-50 transition-all">
              <TableCell className="hidden sm:table-cell">
                {product.image ? (
                  <img
                    alt="Product"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={`http://localhost:8080${product.image}`}
                    width="64"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
              <TableCell className="hidden md:table-cell">Rs {product.price}</TableCell>
              <TableCell className="hidden md:table-cell">{product.createdAt}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-4">
                  <Dialog
                    open={editDialogOpen && selectedProductId === product._id}
                    onOpenChange={(open) => {
                      setEditDialogOpen(open);
                      if (!open) setSelectedProductId(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-2"
                        onClick={() => setSelectedProductId(product._id)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <ProductForm
                        setOpen={setEditDialogOpen}
                        getProducts={getProducts}
                        id={product._id}
                      />
                    </DialogContent>
                  </Dialog>

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
                          This action cannot be undone. This will permanently delete the product.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product._id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AddProducts;
