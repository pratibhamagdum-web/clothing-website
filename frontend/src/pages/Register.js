import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.react_app_api_url}
/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAdmin", data.isAdmin); // ✅ Correct key
      navigate("/");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-4 shadow" style={{ width: "350px" }}>
          <h3 className="text-center mb-3">Register</h3>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="dark" className="w-100">Register</Button>
          </Form>
        </Card>
      </motion.div>
    </Container>
  );
}
