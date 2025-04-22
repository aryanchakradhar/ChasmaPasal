import { Productsdata } from '@/data/Productsdata';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { handleAddToCart } from '@/lib/utils';
import Cart from './Cart';
import { CartContext } from '@/context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductDetail = () => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [data, setData] = useState({});
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products/${id}`);
        setData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch product");
      }
    };
    getProduct();
  }, [id, baseUrl]);

  const handleFavouriteClick = () => {
    setIsFavourite(!isFavourite);
  };

  return (
    <section className="text-gray-600 body-font dark:text-gray-400 overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5  mx-auto flex flex-wrap">
          <img
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded transform transition-all duration-500 hover:scale-105 shadow-lg"
            src={`http://localhost:8080${data.image}`}
          />
        <div className="lg:w-1/2 w-full flex flex-col items-center justify-center text-center min-h-full">
          <h2 className="text-sm title-font text-gray-500 dark:text-gray-300 tracking-widest">
            {data.brand}
          </h2>
          <h1 className="text-gray-900 text-3xl title-font font-medium mb-1 dark:text-white">
            {data.name}
          </h1>
          <p className="leading-relaxed">{data.description}</p>

          {/* Price & Favorite */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="title-font font-medium text-2xl text-gray-900 dark:text-white">
              Rs{data.price}
            </span>
            <button
              className={`rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ${isFavourite ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleFavouriteClick}
            >
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Buttons Below */}
          <div className="flex flex-col mt-6 w-full items-center gap-3">
            <Link
              to={`/try-it-on/${data.sku}`}
              className="w-3/4 hover:text-white text-white bg-black hover:bg-gray-800 border-0 py-2 px-6 focus:outline-none rounded text-center"
            >
              Try It On
            </Link>
            <Dialog>
              <DialogTrigger
                onClick={() => addToCart(data)}
                className="w-3/4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-center"
              >
                Add To Cart
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-4">Shopping Cart</DialogTitle>
                  <Cart />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
