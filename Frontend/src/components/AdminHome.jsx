import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import { faEye } from "@fortawesome/free-solid-svg-icons";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faShoppingCart, faStar, faGlasses, faCalendarCheck, faUserMd } from "@fortawesome/free-solid-svg-icons";

const AdminHome = () => {
  const [counts, setCounts] = useState({
    products: 0,
    doctors: 0,
    users: 0,
    appointments: 0,
    orders: 0,
    reviews: 0,
  });

  const [products, setProducts] = useState([]);
  const baseUrl =   import.meta.env.VITE_APP_BASE_URL;
 

  useEffect(() => {
    const getCountsAndProducts = async () => {
      try {
        const [
          productRes, doctorRes, userRes,
          appointmentRes, orderRes, reviewRes,
          lastProductsRes
        ] = await Promise.all([
          axios.get(`${baseUrl}/count/products`),
          axios.get(`${baseUrl}/count/doctors`),
          axios.get(`${baseUrl}/count/users`),
          axios.get(`${baseUrl}/count/appointments`),
          axios.get(`${baseUrl}/count/orders`),
          axios.get(`${baseUrl}/count/reviews`),
          axios.get(`${baseUrl}/products?limit=4&sort=-createdAt`)
        ]);

        setCounts({
          products: productRes.data.count || 0,
          doctors: doctorRes.data.count || 0,
          users: userRes.data.count || 0,
          appointments: appointmentRes.data.count || 0,
          orders: orderRes.data.count || 0,
          reviews: reviewRes.data.count || 0,
        });

        setProducts(lastProductsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        toast.error("Failed to fetch data");
      }
    };

    getCountsAndProducts();
  }, [baseUrl]);

  return (
    <div className="flex flex-col items-center mt-7 mb-14 space-y-12 w-full">
      {/* Dashboard Header */}
      <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-16 px-6 text-center text-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Admin Dashboard</h1>
        <p className="text-lg md:text-2xl opacity-90">Manage products, users, orders, and more</p>
      </div>

      {/* Stats Grid */}
      <div className="w-[90%] md:w-[85%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard icon={faGlasses} title="Total Products" count={counts.products} color="bg-blue-500" />
          <InfoCard icon={faUserMd} title="Total Doctors" count={counts.doctors} color="bg-green-500" />
          <InfoCard icon={faUsers} title="Total Users" count={counts.users} color="bg-purple-500" />
          <InfoCard icon={faCalendarCheck} title="Appointments" count={counts.appointments} color="bg-red-500" />
          <InfoCard icon={faShoppingCart} title="Product Orders" count={counts.orders} color="bg-yellow-500" />
          <InfoCard icon={faStar} title="Doctor Reviews" count={counts.reviews} color="bg-indigo-500" />
        </div>
      </div>

      {/* Last 4 Products */}
      <div className="w-[90%] md:w-[85%]">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Last 4 Products Added
        </h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          grabCursor={true}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Pagination, Navigation]}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product._id}>
             <ProductCard
              id={product._id}
              imageSrc={product.image}
              title={product.name}
              price={product.price}
              sku={product.sku}
              brand={product.brand}
            />

            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, count, color }) => (
  <div className={`text-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center ${color}`}>
    <FontAwesomeIcon icon={icon} className="text-4xl mb-3" />
    <h2 className="text-lg md:text-xl font-semibold mb-1">{title}</h2>
    <p className="text-2xl md:text-3xl font-bold">{count}</p>
  </div>
);


const ProductCard = ({ id, imageSrc, title, price, sku, brand }) => {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <Link to={`/product/${id}`}>
        <div className="relative h-60 w-full overflow-hidden">
          <img
            alt={title}
            src={imageSrc}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-white text-sm font-medium">{brand}</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col justify-between items-start">
            <h2
              className="text-gray-800 dark:text-white font-semibold text-sm truncate"
              title={title}
            >
              {title}
            </h2>
            <p className="text-black dark:text-indigo-400 font-medium mt-1">
              Rs {price}
            </p>
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Link
          to={`/try-it-on/${sku}`}
          className="inline-flex items-center justify-center w-full text-center bg-gray-800 hover:bg-gray-400 text-white hover:text-black py-2 text-sm rounded-lg transition-all duration-300"
        >
          <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-2" />
          Try It On
        </Link>
      </div>
    </Card>
  );
};


export default AdminHome;
