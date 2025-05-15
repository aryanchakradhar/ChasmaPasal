import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { getProduct } from "@/lib/product";
import { ProductContext } from "@/context/ProductContext";

const ProductForm = ({ setOpen, getProducts, id }) => {
  const navigate = useNavigate();
  const baseUrl =  import.meta.env.BACKEND_BASE_URL ||  import.meta.env.VITE_APP_BASE_URL;
  const { products, setProducts } = useContext(ProductContext);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    image: null,
    sku: "",
    stock: "",
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!id) return;
    const getProductData = async () => {
      const data = await getProduct(id);
      setProduct({ ...data, image: data.image });
      setImagePreview(`http://localhost:8080${data.image}`);
    };
    getProductData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("sku", product.sku);
      formData.append("stock", product.stock);

      if (product.image) {
        formData.append("image", product.image);
      }

      if (id) {
        await axios.put(`${baseUrl}/products/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${baseUrl}/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Product created successfully");
      }

      getProducts();
      setOpen(false);
      navigate("/addProducts");
      setProducts([...products, product]);
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
    <div className="max-h-[90vh] overflow-y-auto w-full px-4">
    <Card className="mx-auto max-w-lg p-6 bg-white shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            {id ? "Update Product" : "Create Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                type="text"
                onChange={handleChange}
                value={product.name}
                name="name"
                placeholder="Eye Wear"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label>Brand Name</Label>
              <Input
                type="text"
                name="brand"
                onChange={handleChange}
                value={product.brand}
                placeholder="Ray Ban"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label>SKU</Label>
              <Input
                type="text"
                name="sku"
                onChange={handleChange}
                value={product.sku}
                placeholder="rayban_predator_noir_vert_classique"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label>Product Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!id}
                className="p-2 border border-gray-300 rounded-md"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Product Preview"
                  className="w-full h-32 object-cover rounded-lg mt-2"
                />
              )}
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                onChange={handleChange}
                name="price"
                value={product.price}
                placeholder="49"
                min="1"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label>Stock</Label>
              <Input
                type="number"
                onChange={handleChange}
                name="stock"
                value={product.stock}
                placeholder="49"
                min="0"
                required
                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                className="min-h-[100px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleChange}
                name="description"
                value={product.description}
                placeholder="Ray Ban Sunglasses"
                required
              />
            </div>
            <Button
                type="submit"
                className="w-full bg-black text-white border border-gray-300 rounded-md hover:bg-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {id ? "Update Product" : "Create Product"}
              </Button>

          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default ProductForm;
