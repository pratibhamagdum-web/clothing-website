import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Form, FormControl, Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import "../css/Navbar.css";

export default function AppNavbar() {
  const isLoggedIn = !!localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const [query, setQuery] = useState("");

  // ✅ Define available nav links for search
  const navLinks = {
    home: "/",
    shop: "/shop",
    cart: "/cart",
    wishlist: "/wishlist",
    profile: "/profile",
    orders: "/my-orders",
    admin: "/admin/dashboard",
  };

  // ✅ Handle search for NavLinks
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) return;

    if (navLinks[q]) {
      navigate(navLinks[q]);
    } else {
      alert("No such page found"); // fallback if input doesn't match
    }
    setQuery("");
  };

  return (
    <Navbar expand="lg" sticky="top" className="shadow-sm p-3 bg-light">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          🛍 FashionHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/shop" className={location.pathname === "/shop" ? "active" : ""}>
              Shop
            </Nav.Link>

            <Nav.Link as={Link} to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
              <FaShoppingCart className="me-1" /> Cart
              {cartItems.length > 0 && <Badge bg="danger" className="ms-1">{cartItems.length}</Badge>}
            </Nav.Link>

            {isLoggedIn && !isAdmin && (
              <Nav.Link as={Link} to="/my-orders" className={location.pathname === "/my-orders" ? "active" : ""}>
                My Orders
              </Nav.Link>
            )}

            {isAdmin && (
              <Nav.Link as={Link} to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>
                Admin Dashboard
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/wishlist" className={location.pathname === "/wishlist" ? "active" : ""}>
              <FaHeart className="me-1 text-danger" /> Wishlist
            </Nav.Link>

            {isLoggedIn && (
              <Nav.Link as={Link} to="/profile" className={location.pathname === "/profile" ? "active" : ""}>
                <FaUser className="me-1" /> Profile
              </Nav.Link>
            )}

            {/* ✅ Search Bar for NavLinks */}
            <Form className="d-flex ms-3" onSubmit={handleSubmit}>
              <FormControl
                type="search"
                name="search"
                placeholder="Search page..."
                className="me-2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" variant="dark">
                <FaSearch />
              </Button>
            </Form>

            {!isLoggedIn ? (
              <Button as={Link} to="/login" className="ms-3">Sign In</Button>
            ) : (
              <Button className="ms-3" onClick={() => { localStorage.clear(); navigate("/"); }}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
