import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  // ✅ Remove from wishlist
  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  // ✅ Add to cart
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart 🛒`);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center fw-bold">❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-muted">Your wishlist is empty.</p>
      ) : (
        <Row>
          {wishlist.map((p) => (
            <Col md={3} sm={6} xs={12} key={p._id} className="mb-4">
              <Card className="shadow-sm h-100 border-0">
                <Card.Img
                  variant="top"
                  src={p.image}
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{p.name}</Card.Title>
                  <Card.Text className="fw-bold">₹{p.price}</Card.Text>

                  <div className="mt-auto d-flex justify-content-between">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => addToCart(p)}
                    >
                      🛒 Add to Cart
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromWishlist(p._id)}
                    >
                      ❌ Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
