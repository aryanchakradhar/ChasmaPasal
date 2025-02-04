import {
    createBrowserRouter,
  } from "react-router-dom";
  import ErrorPage from "./errorpage";
  import Login from "./page/login";

  
export const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
      errorElement: <ErrorPage />,
    },
    {
        path: "*",
        element: <h1>Page Not Found</h1>,
      },
    ])