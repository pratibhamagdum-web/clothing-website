import express from "express";
import multer from "multer";
import {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import Product from "../models/ProductModel.js";

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// 🟢 Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🟡 Admin routes
router.post("/", protect, admin, upload.single("image"), addProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.put("/:id", protect, admin, upload.single("image"), updateProduct);

// 🧾 🛒 New route — Reduce stock after purchase
router.put("/:id/reduce-stock", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Out of stock" });
    }

    product.stock -= 1;
    await product.save();

    res.json({
      message: "Stock reduced successfully",
      newStock: product.stock
    });
  } catch (error) {
    console.error("Error reducing stock:", error);
    res.status(500).json({ message: "Server error while reducing stock" });
  }
});
// 🟢 Admin route — Restock product
router.put("/:id/restock", protect, admin, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid restock amount" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock += Number(amount);
    await product.save();

    res.json({
      message: "Product restocked successfully",
      newStock: product.stock
    });
  } catch (error) {
    console.error("Error restocking product:", error);
    res.status(500).json({ message: "Server error while restocking" });
  }
});


export default router;
