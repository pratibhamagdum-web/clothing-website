import React, { useEffect, useState } from "react";
import { Container, Spinner, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You must login first!");
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
        else {
          alert(data.message);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  if (loading) return <Spinner animation="border" className="mt-4" />;

  if (!user) return <p className="mt-4 text-center">No user data found.</p>;

  return (
    <Container className="mt-4">
      <h2>My Profile</h2>
      <Card className="p-3 mt-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {user.isAdmin && <p><strong>Role:</strong> Admin</p>}
      </Card>
    </Container>
  );
}
