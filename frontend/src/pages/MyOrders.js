import React, { useEffect, useState } from "react";
import { Container, Table, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="dark" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <motion.h2
        className="fw-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        📦 My Orders
      </motion.h2>

      {orders.length === 0 ? (
        <p className="text-center text-muted mt-3">No orders found.</p>
      ) : (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Price ($)</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td>{o._id}</td>
                <td>{o.totalPrice}</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
