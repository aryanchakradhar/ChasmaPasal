const Product = require("../models/product");
const path = require("path");
const fs = require("fs");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product with image upload
const createProduct = async (req, res) => {
  try {
    const { name, brand, description, price, sku, stock } = req.body;
    let imagePath = "";

    // If a file is uploaded, store the file path
    if (req.file) {
      imagePath = `/uploads/images/${req.file.filename}`; // Store file path
    }

    const product = new Product({
      name,
      brand,
      description,
      price,
      sku,
      stock,
      image: imagePath, // Store image path in MongoDB
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product with image upload
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let imagePath = product.image; // Keep existing image path if no new image uploaded

    // If a new file is uploaded, delete the old image and save the new file path
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, "..", product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Delete the old image file
        }
      }
      imagePath = `/uploads/images/${req.file.filename}`; // Store new file path
    }

    // Update product details
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.sku = req.body.sku || product.sku;
    product.stock = req.body.stock || product.stock;
    product.image = imagePath; // Update image path in MongoDB

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete associated image
    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
