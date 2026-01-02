import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function Admin_Login() {
  const navigate = useNavigate(); // To navigate after login

  // Reference to the toast element for notifications
  const toastRef = useRef(null);

  // AuthContext to access login function
  const { login } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Form state to store username and password
  const [formData, setFormData] = useState({ username: "", password: "" });

  // Loading state for spinner
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: "" });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Function to show toast notifications
  const showToast = (message) => {
    setToast({ message });
    const toastElement = toastRef.current;
    if (!toastElement) return;

    const progress = toastElement.querySelector(".toast-progress");
    progress.style.animation = "none";
    progress.offsetHeight; // trigger reflow
    progress.style.animation = "shrink 3s linear forwards";

    const bsToast = new window.bootstrap.Toast(toastElement, { delay: 3000 });
    bsToast.show();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://sports-note-backend.onrender.com/api/auth/admin-login",
        formData,
        { withCredentials: true }
      );

      // login(res.data.user);

      login(res.data.user, res.data.token);
      showToast("Admin login successful!");
      setFormData({ username: "", password: "" });
      setTimeout(() => navigate("/admin", { replace: true }), 10);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Admin Login Form */}
      <section className="admin-login-section container-md px-3 px-md-2 mb-5">
        <div className="admin-login-container">
          <div className="admin-login-heading">
            <h1 className="display-5 m-0 p-0">Admin Login</h1>
          </div>

          <div className="admin-login-form p-4">
            <form className="row g-3" onSubmit={handleSubmit}>

              {/* Username input */}
              <div className="mb-1 col-12">
                <label htmlFor="username" className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              {/* Password input */}
              <div className="mb-2 col-12">
                <label htmlFor="password" className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>

              {/* Login button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary fs-6">Login</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      <div className="toast-container position-fixed p-3">
        <div
          ref={toastRef}
          className="toast custom-toast text-dark border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-progress-wrapper">
            <div className="toast-progress"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin_Login;