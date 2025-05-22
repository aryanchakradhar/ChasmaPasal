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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { id } = useParams();
  const baseUrl =  import.meta.env.VITE_APP_BASE_URL;
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

  const handleAddToCartClick = () => {
    addToCart(data);
    setIsCartOpen(true);
    toast.success(`${data.name} added to cart`);
  };

  // const handleFavouriteClick = () => {
  //   setIsFavourite(!isFavourite);
  //   toast.success(isFavourite ? "Removed from favorites" : "Added to favorites");
  // };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-12 mx-auto mt-15">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
        <img
          alt={data.name}
          className="lg:w-1/2 w-full max-h-[500px] object-contain object-center rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-105"
          src={data.image}
        />                
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              {data.brand}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {data.name}
            </h1>
            <p className="leading-relaxed mb-4 text-justify">{data.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="title-font font-medium text-2xl text-gray-900">
                Rs {data.price}
              </span>
              {/* <button
                onClick={handleFavouriteClick}
                className={`rounded-full w-10 h-10 p-0 border-0 inline-flex items-center justify-center ${isFavourite ? 'text-red-500 bg-red-100' : 'text-gray-500 bg-gray-200'}`}
              >
                <svg fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button> */}
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Link
                to={`/try-it-on/${data.sku}`}
                className="flex-1 text-center text-white bg-black hover:bg-gray-400 hover:text-black hover:border-black py-2 px-6 rounded"
              >
                Try It On
              </Link>
              <button
                onClick={handleAddToCartClick}
                className="flex-1 text-white bg-indigo-500 hover:bg-indigo-600 py-2 px-6 rounded"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    {/* Shipping and Payment Banner */}
    <div className="bg-gray-100 py-8 mt-12 mb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4">
            <i className="fa-solid fa-wallet text-3xl mb-3 text-black"></i>
            <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
            <p className="text-gray-600">All transactions are encrypted and secure</p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <i className="fas fa-shipping-fast text-3xl mb-3 text-black"></i>
            <h3 className="text-lg font-semibold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Fast and reliable delivery all over Nepal.</p>
          </div>
          
          <div className="flex flex-col items-center p-4">
            <i className="fas fa-undo-alt text-3xl mb-3 text-black"></i>
            <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy for unused items</p>
          </div>
        </div>
      </div>
    </div>



      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-2xl font-bold">Shopping Cart</DialogTitle>
          </DialogHeader>
          <Cart onClose={() => setIsCartOpen(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProductDetail;