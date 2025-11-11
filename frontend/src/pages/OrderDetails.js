import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Table, Spinner, Card } from "react-bootstrap";
import { motion } from "framer-motion";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
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

  if (!order) {
    return <p className="text-center text-danger mt-4">Order not found.</p>;
  }

  return (
    <Container className="mt-5">
      <motion.h2 className="fw-bold text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        📄 Order Details
      </motion.h2>

      <Card className="p-3 mt-4 shadow-sm">
        <h5>Shipping Address</h5>
        <p>
          {order.shippingAddress?.address}, {order.shippingAddress?.city},{" "}
          {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
        </p>

        <h5>Payment Method</h5>
        <p>{order.paymentMethod}</p>

        <h5>Status</h5>
        <p>{order.status}</p>
      </Card>

      <h5 className="mt-4">Order Items</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Price ($)</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems?.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.qty}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
