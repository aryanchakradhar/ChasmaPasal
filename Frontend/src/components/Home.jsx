import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faUserMd, faGlasses } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [products, setProducts] = useState([]);
  const baseUrl =   import.meta.env.VITE_APP_BASE_URL;
  const UserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  useEffect(() => {
    if (UserInfo?.role === "admin") {
      navigate("/AdminHome"); // Redirect admin to AdminHomepage
    } else if (UserInfo?.role === "doctor") {
      navigate("/user"); // Redirect doctor to their user page
    }
  }, [UserInfo, navigate]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`);
        const shuffledProducts = shuffleArray(response.data);
        setProducts(shuffledProducts.slice(0, 4));
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch products");
      }
    };
    getProducts();
  }, [baseUrl]);

  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  return (
    <div className="flex flex-col items-center mt-7 mb-7 space-y-10">
      {/* Welcome Banner */}
      <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-16 px-6 text-center text-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-500 ease-in-out">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Welcome to Chasma Pasal!</h1>
        <p className="text-xl md:text-2xl opacity-80">
          Your trusted e-commerce website for buying spectacles
        </p>
      </div>

      {/* Hero Section with Background Images */}
      <div className="w-full">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          className="w-full h-[50rem] shadow-lg rounded-xl"
        >
          <SwiperSlide>
            <div className="h-full w-full relative overflow-hidden rounded-xl">
              <img
                src="/images/bookappointment.jpg"
                alt="Appointment Banner"
                className="absolute top-0 left-0 w-full h-full object-cover transform hover:scale-110 transition-all duration-700"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center space-y-4 text-white p-6">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center">Book an Appointment</h1>
                <p className="text-xl md:text-2xl text-center">With our trusted eye specialists</p>
                <Link
                  to="/AppointmentForm"
                  className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-lg hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  BOOK NOW
                </Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="h-full w-full relative overflow-hidden rounded-xl">
              <img
                src="/images/products.jpg"
                alt="Eyewear Banner"
                className="absolute top-0 left-0 w-full h-full object-cover transform hover:scale-110 transition-all duration-700"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center space-y-4 text-white p-6">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center">Premium Eyewear</h1>
                <p className="text-xl md:text-2xl text-center">Discover our trendy collection</p>
                <Link
                  to="/products"
                  className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-lg hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Featured Products Section */}
      <div className="w-full px-6 md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Featured Products</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          grabCursor={true}
          centeredSlides={true}
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
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Services Banner */}
      <div className="w-full px-6 md:px-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            icon={faCalendar}
            title="Online Appointments"
            description="Book your eye checkup anytime, anywhere"
          />
          <ServiceCard
            icon={faClock}
            title="24/7 Availability"
            description="We're always here to serve your eye care needs"
          />
          <ServiceCard
            icon={faUserMd}
            title="Trusted Doctors"
            description="Certified eye specialists with years of experience"
          />
          <ServiceCard
            icon={faGlasses}
            title="Trendy Spectacles"
            description="Latest designs from top brands worldwide"
          />
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center text-center transition-all transform hover:scale-105">
    <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
      <FontAwesomeIcon icon={icon} className="w-8 h-8 text-black dark:text-blue-300" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const ProductCard = ({ id, imageSrc, title, price, sku }) => (
  <Card className="overflow-hidden rounded-xl shadow-md dark:bg-gray-900 transition-transform transform hover:scale-105">
    <Link to={`/product/${id}`}>
      <div className="h-48 w-full overflow-hidden">
        <img
          alt={title}
          src={`http://localhost:8080${imageSrc}`}
          className="object-cover w-full h-full transition-transform transform hover:scale-110"
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

export default Home;
