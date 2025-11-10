import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";

const stripePromise = loadStripe("pk_test_51RseLoL5gxPl55443640z3QOjKfT5SogQ9ko4PgTHEMNWK6P1gBenx4u2r0OyH0JS7pwnTXUkeBoU19VVKJPqIjE00gOfToYQg");

function CheckoutForm({ cart, totalPrice }) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");

    try {
      // 1️⃣ Create Stripe Payment
      const res = await fetch("http://localhost:5000/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice * 100 }),
      });

      const data = await res.json();
      if (!data.success) return setStatus("Payment failed");

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      // 2️⃣ On Success → Save Order
      if (result.error) {
        setStatus(`Error: ${result.error.message}`);
      } else if (result.paymentIntent.status === "succeeded") {
        await placeOrder();
        setStatus("✅ Payment & Order Successful!");
        localStorage.removeItem("cart");
      }
    } catch (err) {
      setStatus("Error processing payment");
    }
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    console.log("📦 Placing order...", cart, address, token);

    if (!token) {
      setStatus("Please login to place order");
      return;
    }

    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderItems: cart,
        shippingAddress: address,
        paymentMethod: "Stripe",
        totalPrice,
      }),
    });

    const data = await res.json();
    console.log("📦 Order API Response:", data);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h5 className="mt-3">Shipping Address</h5>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Address</Form.Label>
            <Form.Control name="address" onChange={handleInputChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>City</Form.Label>
            <Form.Control name="city" onChange={handleInputChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control name="postalCode" onChange={handleInputChange} required />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-2">
            <Form.Label>Country</Form.Label>
            <Form.Control name="country" onChange={handleInputChange} required />
          </Form.Group>
        </Col>
      </Row>

      <h5 className="mt-4">Card Details</h5>
      <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
        <CardElement />
      </div>
      <motion.div whileHover={{ scale: 1.05 }}>
        <Button className="mt-3" variant="dark" type="submit" disabled={!stripe}>
          Pay ₹{totalPrice.toFixed(2)}
        </Button>
      </motion.div>
      {status && <p className="mt-3">{status}</p>}
    </Form>
  );
}

export default function Checkout() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <Container className="mt-5">
      <h2>Checkout</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm cart={cart} totalPrice={totalPrice} />
      </Elements>
    </Container>
  );
}
