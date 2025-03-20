import axios from "axios";

export const getProducts = async () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  try {
    const response = await axios.get(`${baseUrl}/products`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProduct = async (id) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  try {
    const response = await axios.get(`${baseUrl}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const createProduct = async (product) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  try {
    const response = await axios.post(`${baseUrl}/products`, product);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const updateProduct = async (id, product) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  try {
    const response = await axios.put(`${baseUrl}/products/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const deleteProduct = async (id) => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  try {
    const response = await axios.delete(`${baseUrl}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};