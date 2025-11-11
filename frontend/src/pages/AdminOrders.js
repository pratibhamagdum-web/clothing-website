import React, { useEffect, useState } from "react";
import { Container, Table, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${process.env.react_app_api_url}
api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to fetch orders");
        return;
      }

      const data = await res.json();
      console.log("📦 Orders fetched:", data);
      setOrders(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      alert("Network error while fetching orders");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${process.env.react_app_api_url}
api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update order");
        return;
      }

      fetchOrders();
    } catch (err) {
      console.error("❌ Update Error:", err);
      alert("Network error while updating order");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await fetch(`${process.env.react_app_api_url}/
api/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.message || "Failed to delete order");
        return;
      }

      fetchOrders();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Network error while deleting order");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="fw-bold text-center">📦 Admin Order Management</h2>
      <Table bordered responsive className="mt-4">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total ($)</th>
            <th>Status</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((o) => (
              <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td>{o.user?.name || "Guest"}</td>
                <td>{o.totalPrice}</td>
                <td>{o.status}</td>
                <td>
                  <Form.Select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </Form.Select>
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => deleteOrder(o._id)}>
                    Delete
                  </Button>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}
