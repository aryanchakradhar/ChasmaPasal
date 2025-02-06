import {
    createBrowserRouter,
  } from "react-router-dom";
  import ErrorPage from "./errorpage";
  import Login from "./page/login";
  import { SignUp } from "./page/signup";
 
  
export const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <ErrorPage />,
    },
    {
        path: "*",
        element: <h1>Page Not Found</h1>,
      },
    ])