import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProductProvider } from "./context/ProductContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UserProvider } from './context/UserContext';
import { NotificationProvider } from "./context/NotificationContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <NotificationProvider>
      <ProductProvider>
        <CartProvider>
            <App />
        </CartProvider>
      </ProductProvider>
      </NotificationProvider>
    </UserProvider>
  </StrictMode>,
)
