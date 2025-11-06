import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #1e1e2f, #2d2d44)", // modern dark gradient
        color: "#f1f1f1",
      }}
      className="pt-5 mt-4"
    >
      {/* Top Divider */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, #ff6a00, #ee0979)",
        }}
      ></div>

      {/* Content with padding */}
      <Container className="pt-4">
        <Row className="text-center text-md-start">
          {/* Brand Info */}
          <Col md={4} className="mb-4">
            <h4 className="fw-bold">FashionHub</h4>
            <p className="small text-muted">
              Trendy, stylish & affordable fashion for everyone.  
              Discover your style with us!
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/shop" className="text-light text-decoration-none">Shop</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </Col>

          {/* Social Media */}
          <Col md={4} className="mb-4">
            <h5 className="fw-bold">Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#" className="text-light fs-5"><FaFacebookF /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaTwitter /></a>
            </div>
          </Col>
        </Row>

        {/* Bottom Bar */}
        <div className="text-center py-3 border-top border-secondary mt-3">
          <p className="mb-0 small">
            © {new Date().getFullYear()} <b>ClothingSite</b> | All Rights Reserved
          </p>
        </div>
      </Container>
    </footer>
  );
}
