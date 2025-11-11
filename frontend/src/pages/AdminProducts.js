import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [restockAmounts, setRestockAmounts] = useState({});

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const url = editId
        ? `${process.env.REACT_APP_API_URL}/api/products/${editId}`
        : `${process.env.REACT_APP_API_URL}/api/products`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setEditId(null);
        setName("");
        setPrice("");
        setCategory("");
        setDescription("");
        setImage(null);
        fetchProducts();
      } else {
        alert(data.message || "Failed to save product");
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) fetchProducts();
      else alert(data.message || "Failed to delete product");
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod._id);
    setName(prod.name);
    setPrice(prod.price);
    setCategory(prod.category);
    setDescription(prod.description);
    setImage(null);
  };

  const setRestockAmount = (id, value) => {
    setRestockAmounts((prev) => ({ ...prev, [id]: value }));
  };

  const handleRestock = async (productId) => {
    const amount = Number(restockAmounts[productId]);
    if (!amount || amount <= 0) return alert("Enter a valid amount");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products/${productId}/restock`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount }),
        }
      );
      const data = await res.json();
      if (!res.ok) return alert(data.message);

      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, stock: data.newStock } : p))
      );
      alert(`✅ Product restocked! New stock: ${data.newStock}`);
    } catch (err) {
      console.error(err);
      alert("Error restocking product");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Product Management</h2>

      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Control
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Col>
          <Col md={2}>
            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
          </Col>
        </Row>
        <Button type="submit" className="mt-3" variant={editId ? "warning" : "success"}>
          {editId ? "Update Product" : "Add Product"}
        </Button>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Category</th>
              <th>Description</th>
              <th>Stock</th>
              <th>Restock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <motion.tr key={prod._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td>
                  <img
                    src={
                      prod.image?.startsWith("http")
                        ? prod.image
                        : `${process.env.REACT_APP_API_URL}/uploads/${prod.image}`
                    }
                    alt={prod.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>{prod.name}</td>
                <td>${prod.price}</td>
                <td>{prod.category}</td>
                <td>{prod.description}</td>
                <td>{prod.stock ?? 0}</td>
                <td>
                  <Form.Control
                    type="number"
                    placeholder="Add stock"
                    size="sm"
                    min="1"
                    style={{ width: "80px", display: "inline-block", marginRight: "5px" }}
                    onChange={(e) => setRestockAmount(prod._id, e.target.value)}
                  />
                  <Button size="sm" variant="info" onClick={() => handleRestock(prod._id)}>
                    Restock
                  </Button>
                </td>
                <td>
                  <Button size="sm" variant="warning" onClick={() => handleEdit(prod)} className="me-2">
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(prod._id)}>
                    Delete
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
