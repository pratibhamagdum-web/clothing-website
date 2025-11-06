import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Home.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* ✅ Hero Section */}
      {/* ✅ Hero Section */}
<section
  className="text-center text-white"
  style={{
    backgroundImage: `url('/img/image.png')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "300px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <div
    style={{
      backgroundColor: "rgba(245, 240, 240, 0.5)",
      padding: "40px",
      borderRadius: "10px",
      maxWidth: "600px",
    }}
    data-aos="fade-up"
  >
    <h1
      className="fw-bold"
      style={{ color: "#4d2c50ff" }} // ✨ Change heading color
    >
      Welcome to Our Store
    </h1>
    <p
      className="mt-3"
      style={{ color: "#09010cff", fontSize: "18px" }} // ✨ Change para color
    >
      Trendy • Affordable • Quality
    </p>
    <a
      href="/shop"
      className="btn btn-primary btn-lg mt-3"
      data-aos="zoom-in"
      data-aos-delay="400"
    >
      Shop Now
    </a>
  </div>
</section>

      {/* ✅ Cloud Shape Image Grid with text + animation */}
      {/* ✅ Cloud Shape Image Grid with text + animation */}
<section className="container my-5">
  <h2 className="text-center mb-4 section-heading" data-aos="fade-left">
  Our Lovely Gallery
</h2>
  <p
    className="text-center mb-5 text-muted"
    data-aos="fade-left"
    data-aos-delay="200"
  >
    A collection of our favorite looks — soft, stylish, and picture-perfect.
  </p>

  <div className="image-grid" data-aos="fade-left" data-aos-delay="400">
    <div className="grid-item text-center">
      <div className="cloud-shape">
        <img src="/img/flowerdress.jpeg" alt="Summer Floral Dress" />
      </div>
      <p className="gallery-caption">Summer Floral Dress</p>
    </div>

    <div className="grid-item text-center">
      <div className="cloud-shape">
        <img src="/img/Hoodie.jpeg" alt="Casual Hoodie Comfort" />
      </div>
      <p className="gallery-caption">Casual Hoodie Comfort</p>
    </div>

    <div className="grid-item text-center">
      <div className="cloud-shape">
        <img src="/img/silk.jpeg" alt="Elegant Silk Saree" />
      </div>
      <p className="gallery-caption">Elegant Silk Saree</p>
    </div>
  </div>
</section>


      {/* ✅ Featured Products */}
      <section className="container my-5">
        <h2 className="text-center mb-4 section-heading" data-aos="fade-right">
  Featured Products
</h2>

        {loading ? (
          <p className="text-center text-muted">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-muted">No products available.</p>
        ) : (
          <div className="row">
            {products.slice(0, 4).map((product) => (
              <div
                className="col-md-3 mb-4"
                key={product._id}
                data-aos="fade-up"
              >
                <div className="card shadow-sm border-0">
                  <img
                    src={
                      product.image?.startsWith("http")
                        ? product.image
                        : `/images/${product.image}`
                    }
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">₹{product.price}</p>
                    <a
                      href={`/product/${product._id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
