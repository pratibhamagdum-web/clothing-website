import React, { useState } from "react";
import { Modal, Button, Form, Tabs, Tab } from "react-bootstrap";

export default function SignInModal({ show, handleClose, setIsLoggedIn }) {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    const res = await fetch("${process.env.react_app_api_url}
api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      handleClose();
    } else {
      alert(data.message || "Login failed");
    }
  };

  const handleRegister = async () => {
    const res = await fetch("${process.env.react_app_api_url}
api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      handleClose();
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{activeTab === "login" ? "Sign In" : "Register"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="login" title="Login">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" onChange={handleChange} />
              </Form.Group>
              <Button variant="primary" onClick={handleLogin}>
                Login
              </Button>
            </Form>
          </Tab>
          <Tab eventKey="register" title="Register">
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" type="text" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" onChange={handleChange} />
              </Form.Group>
              <Button variant="success" onClick={handleRegister}>
                Register
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
