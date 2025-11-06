import React from "react";
import { Container, Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <Container className="mt-5 text-center">
        <h3>No order details found.</h3>
        <Button onClick={() => navigate("/shop")} variant="primary">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-success">✅ Payment Successful!</h2>
      <p>Your order has been placed successfully.</p>

      <h4 className="mt-4">Order Summary</h4>
      <Table bordered>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td>{item.name}</td>
              <td>${item.price.toFixed(2)}</td>
            </motion.tr>
          ))}
        </tbody>
      </Table>

      <h5>Total: ${order.total.toFixed(2)}</h5>

      <Button className="mt-3" onClick={() => navigate("/shop")} variant="primary">
        Continue Shopping
      </Button>
    </Container>
  );
}
