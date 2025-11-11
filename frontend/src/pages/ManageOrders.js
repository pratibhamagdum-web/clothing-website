import React, { useEffect, useState } from "react";
import { Container, Table, Form } from "react-bootstrap";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${process.env.react_app_api_url}
/api/orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Admin token
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${process.env.react_app_api_url}
api/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status }),
    });

    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status } : order
      )
    );
  };

  return (
    <Container>
      <h3 className="mb-4">Manage Orders</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Total ($)</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user?.name}</td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                <Form.Select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
