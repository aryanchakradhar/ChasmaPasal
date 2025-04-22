const express = require("express");
const { upload } = require("../config/fileConfig"); // Import multer config
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Route to get all products
router.get("/", getProducts);

// Route to get a specific product by its ID
router.get("/:id", getProductById);

// Route to create a new product with image upload
router.post("/", upload.single("image"), createProduct);

// Route to update an existing product with an image upload (if provided)
router.put("/:id", upload.single("image"), updateProduct);

// Route to delete a product
router.delete("/:id", deleteProduct);

module.exports = router;
