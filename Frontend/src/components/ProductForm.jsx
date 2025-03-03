import { useContext, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Textarea } from "./ui/textarea"
import { getProduct } from "@/lib/product"
import { ProductContext } from "@/context/ProductContext"

const ProductForm = ({ setOpen, getProducts, id }) => {
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const { products, setProducts } = useContext(ProductContext);

  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    image: "",
    sku: "",
    stock: "",
  })

  useEffect(()=>{
    if(!id) return
    const getProductData = async()=>{
      const data = await getProduct(id)
      setProduct(data)
    }
    getProductData()
  }
  , [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      if(id){
        await axios.put(`${baseUrl}/products/${id}`, product);
        toast.success("Product updated successfully");
        getProducts()
        setOpen(false)
        navigate("/addProducts");
      }else{
        await axios.post(`${baseUrl}/products`, product);
        toast.success("Product created successfully");
        getProducts()
        setOpen(false)
        navigate("/addProducts");
      }
      setProducts([...products, product])
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed");
      setProduct(false)
    }
  }
  return (
    <div className="flex items-center justify-center">
        <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}  className="grid gap-4 w-72">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Product Name</Label>
              <Input
                id="name"
                type="text"
                onChange={handleChange}
                value={product.name}
                name="name"
                placeholder="eye wear"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Brand Name</Label>
              <Input
                id="brand"
                type="text"
                name= "brand"
                onChange={handleChange}
                value={product.brand}
                placeholder="Ray Ban"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">SKU</Label>
              <Input
                id="sku"
                type="text"
                name= "sku"
                onChange={handleChange}
                value={product.sku}
                placeholder="rayban_predator_noir_vert_classique"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Image</Label>
              <Input
                id="image"
                type="text"
                onChange={handleChange}
                value={product.image}
                name ="image"
                placeholder="https://dummyimage.com/400x400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Price</Label>
              <Input
                id="price"
                type="text"
                onChange={handleChange}
                name ="price"
                value={product.price}
                placeholder="49"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Stock</Label>
              <Input
                id="stock"
                type="number"
                onChange={handleChange}
                name ="stock"
                value={product.stock}
                placeholder="49"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                className="min-h-[100px]"
                id="description"
                type="text"
                onChange={handleChange}
                name= "description"
                value={product.description}
                placeholder="Ray Ban"
              />
            </div>
            <Button type="submit" className="w-full">
              {id?'Update Product': 'Create Product'}
            </Button>
          </form>
        </CardContent>
        </Card>
      </div>
  )
}

export default ProductForm