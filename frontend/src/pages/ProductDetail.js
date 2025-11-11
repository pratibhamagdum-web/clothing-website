import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${process.env.react_app_api_url}
/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  const addToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  if (!product) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  return (
    <Container className="mt-5">
      <Row className="align-items-center">
        {/* Product Image */}
        <Col md={6} className="mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
            }}
          >
           <img
  src={
    product.image?.startsWith("http")
      ? product.image
      : `${process.env.react_app_api_url}
uploads/${product.image}`
  }
  alt={product.name}
  style={{
    width: "100%",
    height: "400px",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
/>
          </motion.div>
        </Col>

        {/* Product Details */}
        <Col md={6}>
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="fw-bold mb-3">{product.name}</h2>
            <h4 className="text-danger fw-bold mb-3">₹{product.price}</h4>
            <p className="text-muted">{product.description}</p>

            {/* Additional content */}
            <ul className="mb-4">
              <li>✅ High-quality material</li>
              <li>🚚 Fast & Free Delivery</li>
              <li>💳 Secure Payment</li>
              <li>🔄 Easy Returns</li>
            </ul>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="danger"
                className="px-4 py-2 fw-bold"
                onClick={addToCart}
              >
                🛒 Add to Cart
              </Button>
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      {/* Related Products Section */}
      <Row className="mt-5">
        <Col>
          <h3 className="fw-bold text-center mb-4">You may also like</h3>
          <p className="text-center text-muted">
            Explore more products that match your style
          </p>
        </Col>
      </Row>
    </Container>
  );
}
