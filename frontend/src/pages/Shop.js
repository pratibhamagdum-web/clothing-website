import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { motion } from "framer-motion";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("all");

  // 🩶 Wishlist + Cart states
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  // 🔹 Fetch Products
  useEffect(() => {
    fetch(`${process.env.react_app_api_url}
/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // 💾 Save wishlist + cart to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ❤️ Handle Wishlist
  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item._id === product._id)) {
      setWishlist(wishlist.filter((item) => item._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // 🛒 Add to Cart + Reduce Stock
  const addToCart = async (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      alert("🛍 This item is already in your cart!");
      return;
    }

    try {
      // 🔹 Reduce stock in backend
      const response = await fetch(
        `${process.env.react_app_api_url}
api/products/${product._id}/reduce-stock`,
        { method: "PUT" }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update stock!");
        return;
      }

      // 🔹 Update frontend stock
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, stock: data.newStock } : p
        )
      );

      // 🔹 Add product to cart
      const updatedCart = [...cart, { ...product, stock: data.newStock }];
      setCart(updatedCart);

      alert("✅ Added to cart! Stock updated.");
    } catch (error) {
      console.error("Error reducing stock:", error);
      alert("Something went wrong while updating stock!");
    }
  };

  // 🔍 Filter + Sort + Category
  const filteredProducts = products
    .filter(
      (p) =>
        (category === "all" || p.category?.toLowerCase() === category) &&
        p.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      return 0;
    });

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center fw-bold">🛍 Our Products</h2>

      {/* 🔽 Filters Section */}
      <Row className="mb-4 d-flex align-items-center">
        {/* 🔍 Search */}
        <Col md={4} xs={12} className="mb-2">
          <Form.Control
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        {/* 📂 Category */}
        <Col md={4} xs={12} className="mb-2">
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="mens">Men</option>
            <option value="womens">Women</option>
            <option value="kids">Kids</option>
          </Form.Select>
        </Col>

        {/* ↕ Sort */}
        <Col md={4} xs={12}>
          <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </Form.Select>
        </Col>
      </Row>

      {/* 🌀 Loader or Empty or Products */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-muted">
          <img
            src="/empty-cart.png"
            alt="No products"
            style={{ width: "150px", marginBottom: "15px" }}
          />
          <p>No products found. Try another search!</p>
        </div>
      ) : (
        <Row>
          {filteredProducts.map((p) => (
            <Col md={3} sm={6} xs={12} key={p._id} className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="shadow-sm h-100 border-0">
                  <div style={{ position: "relative" }}>
                    <Card.Img
                      variant="top"
                      src={p.image}
                      onError={(e) => (e.target.src = "/fallback.jpg")}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "10px",
                        fontSize: "12px",
                      }}
                    >
                      {p.category || "New"}
                    </span>
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{p.name}</Card.Title>
                    <Card.Text className="mb-1 fw-bold">₹{p.price}</Card.Text>
                    {/* 🧾 Stock display */}
                    <Card.Text className="text-muted mb-2">
                      Stock:{" "}
                      {p.stock > 0 ? (
                        <span>{p.stock}</span>
                      ) : (
                        <span className="text-danger">Out of Stock</span>
                      )}
                    </Card.Text>
                    <div className="d-flex gap-2 mt-auto">
                      {/* ❤️ Wishlist */}
                      <Button
                        variant={
                          wishlist.find((item) => item._id === p._id)
                            ? "danger"
                            : "outline-danger"
                        }
                        size="sm"
                        onClick={() => toggleWishlist(p)}
                      >
                        ❤️{" "}
                        {wishlist.find((item) => item._id === p._id)
                          ? "Remove"
                          : "Wishlist"}
                      </Button>

                      {/* 🛒 Add to Cart */}
                      <Button
                        variant="dark"
                        size="sm"
                        disabled={p.stock <= 0}
                        onClick={() => addToCart(p)}
                      >
                        🛒 Add
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
