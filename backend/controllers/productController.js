import Product from "../models/ProductModel.js";

// ✅ GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const updatedProducts = products.map((prod) => ({
      ...prod._doc,
      image: prod.image
        ? `${req.protocol}://${req.get("host")}/uploads/${prod.image}`
        : "",
    }));

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      ...product._doc,
      image: product.image
        ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
        : "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADD product (Admin only)
export const addProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !category || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({ name, price, category, description, image });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    if (image) product.image = image;

    await product.save();
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
