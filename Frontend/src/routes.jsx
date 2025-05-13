import {
    createBrowserRouter,
  } from "react-router-dom";
import ErrorPage from "./errorpage";
import Login from "./page/Login";
import Signup  from "./page/Signup";
import Dashboard from "./page/Dashboard";
import Home from "./components/Home";
import AppointmentForm from "./components/AppointmentForm";
import Products from "./components/Products"
import AddProducts from "./page/AddProducts";
import ProductDetail from "./components/ProductDetail"
import AboutUs from "./page/AboutUs";
import Checkout from "./page/Checkout";
import OrderSuccess from "./page/OrderSuccess";
import Orders from "./page/Orders";
import OrderStatus from "./page/OrderStatus";
import UserProfile from "./components/UserProfile";
import DoctorReview from "./page/DoctorReview";
import PerDoctorReviews from "./components/PerDoctorReviews";
import AppCanvas from "./page/AppCanvas";
import NotificationPage from "./page/NotificationPage";
import AddDoctor  from "./page/AddDoctor";
import ForgotPassword from "./page/Forgotpassword";
import AdminHome from "./components/AdminHome";
  
export const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <Signup />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
      errorElement: <ErrorPage />,

    },
    {
        path: "/",
        element: <Dashboard />,
        errorElement: <ErrorPage />,
        children:[
          {
            path: '',
            element: <Home/>
          },
          {
            path: 'AdminHome',
            element: <AdminHome/>
          },
          {
            path: 'appointmentform',
            element: <AppointmentForm/>
          },
          {
            path: 'products',
            element: <Products/>
          },
          {
            path: 'product/:id',
            element: <ProductDetail/>
          },
          {
            path: 'addProducts',
            element: <AddProducts/>
          },
          {
            path: 'aboutus',
            element: <AboutUs/>
          },
          {
            path: "checkout",
            element: <Checkout/>
          },
          {
            path: 'ordersuccess',
            element: <OrderSuccess/>
          },
          {
            path: 'orders',
            element: <Orders/>
          },
          {
            path: '/orderstatus',
            element: <OrderStatus />
          },
          {
            path: 'user',
            element: <UserProfile/>
          },  
          {
            path: "doctor-reviews",
            element: <DoctorReview/>,
          },
          {
            path: "doctor-reviews/:doctorId",
            element: <PerDoctorReviews/>
          },
          {
            path: "notifications",
            element: <NotificationPage/>
          },
        {
          path: "try-it-on/:sku",
          element: <AppCanvas/>,
        },
        {
          path: "add-doctor",
          element: <AddDoctor/>
  
        }
        ]
      },
    ])