import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { toast } from "react-toastify";
import axios from "axios";

const Products = () => {
  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState([]);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      }
    };
    getProducts();
  }, [baseUrl]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  let sortedProducts = [...products];
  sortedProducts.sort((a, b) => {
    if (filter === 'low-high') return a.price - b.price;
    if (filter === 'high-low') return b.price - a.price;
    return 0;
  });

  return (
    <main className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-black min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 container mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Browse Our Products
        </h1>
        <div className="flex gap-3 flex-wrap">
          <select
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            value={filter}
            onChange={e => handleFilterChange(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>

          {localStorage.getItem("userInfo") &&
            JSON.parse(localStorage.getItem("userInfo")).role === "admin" && (
              <Link to="/addProducts">
               <button className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-black hover:text-white text-sm">
                Add Product
              </button>

              </Link>
            )}
        </div>
      </div>

      <section className="container mx-auto">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              imageSrc={product.image}
              title={product.name}
              price={product.price}
              sku={product.sku}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

const ProductCard = ({ id, imageSrc, title, price, sku }) => {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md dark:bg-gray-900 transition-transform transform hover:scale-105">
      <Link to={`/product/${id}`}>
        <div className="h-48 w-full overflow-hidden">
          <img
            alt={title}
            src={`http://localhost:8080${imageSrc}`}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-800 dark:text-white font-semibold text-sm truncate">{title}</h2>
            <p className="text-gray-600 font-semibold text-sm">Rs {price}</p>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Link
          to={`/try-it-on/${sku}`}
          className="inline-block w-full text-center bg-black hover:bg-gray-800 hover:text-white text-white py-1.5 text-sm rounded-md"
        >
          Try It On
        </Link>
      </div>
    </Card>
  );
};

export default Products;
