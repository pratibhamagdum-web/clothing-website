import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBoxOpen, FaShoppingCart } from "react-icons/fa";

export default function AdminDashboard() {
  const cardVariants = {
    hover: { scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" },
  };

  return (
    <Container className="mt-5">
      <h2 className="fw-bold text-center mb-4">✨ Admin Dashboard ✨</h2>
      <Row className="g-4">
        {/* Manage Products */}
        <Col md={6}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card
              className="p-4 text-center border-0"
              style={{
                borderRadius: "18px",
                background: "linear-gradient(135deg, #a0eaf0ff, #7aabf0ff)",
                color: "#0c0c0cff",
              }}
            >
              <FaBoxOpen size={50} className="mb-3" />
              <Card.Title className="fw-bold">Manage Products</Card.Title>
              <p>Easily add, update or remove products.</p>
              <Link to="/admin/products" className="btn btn-light fw-bold mt-2">
                Go to Products
              </Link>
            </Card>
          </motion.div>
        </Col>

        {/* Manage Orders */}
        <Col md={6}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card
              className="p-4 text-center border-0"
              style={{
                borderRadius: "18px",
                background: "linear-gradient(135deg, #ecacf3ff, #f8919fff)",
                color: "#0c0c0cff",
              }}
            >
              <FaShoppingCart size={50} className="mb-3" />
              <Card.Title className="fw-bold">Manage Orders</Card.Title>
              <p>Track and manage customer orders efficiently.</p>
              <Link to="/admin/orders" className="btn btn-light fw-bold mt-2">
                Go to Orders
              </Link>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
