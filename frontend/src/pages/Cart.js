import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const removeFromCart = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Container className="mt-4">
      <h2 className="fw-bold">🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-5"
        >
          <h4>Your cart is empty</h4>
          <p className="text-muted">Looks like you haven’t added anything yet.</p>
          <Button
            variant="dark"
        
            className="mt-3"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </Button>
        </motion.div>
      ) : (
        <>
          <Table bordered hover responsive className="mt-3 shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Product</th>
                <th>Price (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(i)}
                    >
                      Remove
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
          <h5 className="fw-bold">Total: ₹{totalPrice}</h5>
          <Button
            className="mt-3"
            onClick={() => navigate("/checkout")}
            variant="success"
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
  );
}
