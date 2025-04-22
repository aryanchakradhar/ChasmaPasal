import { Productsdata } from '@/data/Productsdata';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const handleAddToCart = (id, addToCart) => {
  let product = {}
  ProductsData.map(data => {
    if (data.id == id) {
      product.id = data.id;
      product.quantity = 1;
      product.name = data.name;
      product.price = data.price;
    }
})
  addToCart(product);
};