import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { toast } from "react-toastify";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";  // Import FontAwesome icons

const Products = () => {
  const [filter, setFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl =  import.meta.env.BACKEND_BASE_URL ||  import.meta.env.VITE_APP_BASE_URL;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 container mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Premium Collection
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover the perfect eyewear for your style
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
            value={filter}
            onChange={e => handleFilterChange(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>

          {localStorage.getItem("userInfo") &&
            JSON.parse(localStorage.getItem("userInfo")).role === "admin" && (
              <Link 
                to="/addProducts"
                className="flex items-center gap-2 bg-black hover:bg-gray-400 text-white hover:text-black px-4 py-2 rounded-lg shadow hover:shadow-md text-sm transition-all"
              >
                <FontAwesomeIcon icon={faCartPlus} className="h-4 w-4" />
                Add Product
              </Link>
            )}
        </div>
      </div>

      <section className="container mx-auto">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faEye} className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mt-4">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">We couldn't find any products matching your criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                imageSrc={product.image}
                title={product.name}
                price={product.price}
                sku={product.sku}
                brand={product.brand}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

const ProductCard = ({ id, imageSrc, title, price, sku, brand }) => {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <Link to={`/product/${id}`}>
        <div className="relative h-60 w-full overflow-hidden">
          <img
            alt={title}
            src={`http://localhost:8080${imageSrc}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-sm font-medium">{brand}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-between items-start">
            <h2 className="text-gray-800 dark:text-white font-semibold text-sm truncate" title={title}>
              {title}
            </h2>
            <p className="text-black dark:text-indigo-400 font-medium mt-1">Rs {price}</p>
          </div>
        </div>
      </Link> 
      <div className="p-4 pt-0">
        <Link
          to={`/try-it-on/${sku}`}
          className="inline-flex items-center justify-center w-full text-center bg-gray-800 hover:bg-gray-400 text-white hover:text-black  py-2 text-sm rounded-lg transition-all duration-300"
        >
          <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-2" />
          Try It On
        </Link>
      </div>

    </Card>

  );
};

export default Products;
