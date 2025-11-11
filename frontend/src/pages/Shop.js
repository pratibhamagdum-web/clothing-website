import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Form } from "react-bootstrap";
import { motion } from "framer-motion";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("all");

  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem("wishlist")) || []);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  // Fetch Products
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products`)
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

  // Persist wishlist/cart
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item._id === product._id)) {
      setWishlist(wishlist.filter((item) => item._id !== product._id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const addToCart = async (product) => {
    if (cart.find((item) => item._id === product._id)) {
      alert("🛍 Already in cart!");
      return;
    }

    try {
      // Optional: Reduce stock in backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${product._id}/reduce-stock`, { method: "PUT" });
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update stock!");
        return;
      }

      setProducts((prev) => prev.map((p) => (p._id === product._id ? { ...p, stock: data.newStock } : p)));
      setCart([...cart, { ...product, stock: data.newStock }]);
      alert("✅ Added to cart!");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart!");
    }
  };

  const filteredProducts = products
    .filter((p) => (category === "all" || p.category?.toLowerCase() === category) && p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sort === "low-high" ? a.price - b.price : sort === "high-low" ? b.price - a.price : 0));

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center fw-bold">🛍 Our Products</h2>

      <Row className="mb-4 d-flex align-items-center">
        <Col md={4} xs={12} className="mb-2">
          <Form.Control placeholder="🔍 Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </Col>
        <Col md={4} xs={12} className="mb-2">
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="mens">Men</option>
            <option value="womens">Women</option>
            <option value="kids">Kids</option>
          </Form.Select>
        </Col>
        <Col md={4} xs={12}>
          <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center"><Spinner animation="border" variant="dark" /></div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center text-muted">
          <p>No products found. Try another search!</p>
        </div>
      ) : (
        <Row>
          {filteredProducts.map((p) => (
            <Col md={3} sm={6} xs={12} key={p._id} className="mb-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card className="shadow-sm h-100 border-0">
                  <Card.Img variant="top" src={p.image} style={{ height: "200px", objectFit: "cover" }} />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{p.name}</Card.Title>
                    <Card.Text className="mb-1 fw-bold">₹{p.price}</Card.Text>
                    <Card.Text className="text-muted mb-2">Stock: {p.stock > 0 ? p.stock : <span className="text-danger">Out of Stock</span>}</Card.Text>
                    <div className="d-flex gap-2 mt-auto">
                      <Button variant={wishlist.find((item) => item._id === p._id) ? "danger" : "outline-danger"} size="sm" onClick={() => toggleWishlist(p)}>
                        ❤️ {wishlist.find((item) => item._id === p._id) ? "Remove" : "Wishlist"}
                      </Button>
                      <Button variant="dark" size="sm" disabled={p.stock <= 0} onClick={() => addToCart(p)}>🛒 Add</Button>
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
