import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  // Show toast
  const showToast = (message) => {
    setToast({ message });
    const toastElement = toastRef.current;
    if (!toastElement) return;

    const progress = toastElement.querySelector(".toast-progress");
    progress.style.animation = "none";
    progress.offsetHeight;
    progress.style.animation = "shrink 3s linear forwards";

    const bsToast = new window.bootstrap.Toast(toastElement, { delay: 3000 });
    bsToast.show();
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      showToast("Login successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <section className="login-section container-md px-3 px-md-2 mb-5">
        <div className="login-container">
          <div className="login-heading">
            <h1 className="display-5 m-0 p-0">Login</h1>
            <p className="fs-4 m-0 p-0 mt-3">Sign in to access your account and continue.</p>
          </div>

          <div className="login-form p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="mb-1 col-12">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2 col-12">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary fs-6">Login</button>
              </div>

              <div className="col-12 sign-up mt-4">
                <p className="m-0 p-0">
                  Don't have an account? <Link to="/sign-up" className="link rounded-pill">Sign Up</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Toast */}
      <div className="toast-container position-fixed p-3">
        <div ref={toastRef} className="toast custom-toast text-dark border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-progress-wrapper">
            <div className="toast-progress"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
