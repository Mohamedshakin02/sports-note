import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

function Sign_Up() {
  const navigate = useNavigate(); // To navigate after login
  const toastRef = useRef(null); // Ref for toast notifications

  // State for toast messages, loading spinner, and Google Sign-In readiness
  const [toast, setToast] = useState({ message: "" });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext); // Auth context to store user info after signup/login

  // Function to display toast notifications
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

  // State for signup form data
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  // Handle input change for signup form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Send signup request to backend
    try {

      // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
      // const res = await axios.post(
      //   "https://sports-note-backend2.onrender.com/api/auth/signup",
      //   formData,
      //   { withCredentials: true }
      // );

      const res = await axios.post(
        "https://sports-note-backend2.onrender.com/api/auth/signup",
        formData
      );

      localStorage.setItem("token", res.data.token); // Store token in localStorage

      // login(res.data.user);

      login(res.data.user, res.data.token); // Store user in AuthContext

      showToast("Signup successful!");
      setFormData({ username: "", email: "", password: "" }); // Reset form
      navigate("/", { replace: true }); // Navigate to home page
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In login/signup
  const handleGoogleLogin = async (response) => {

    if (!response.credential) return showToast("Google login failed");
    setLoading(true);
    try {

      // This code is commented out to switch from cookies auth auth to token/localStorage-based auth
      // const res = await axios.post("https://sports-note-backend2.onrender.com/api/auth/google-login",
      //   { token: response.credential },
      //   { withCredentials: true }
      // );

      const resGoogle = await axios.post(
        "https://sports-note-backend2.onrender.com/api/auth/google-login",
        { token: response.credential }
      );

      localStorage.setItem("token", resGoogle.data.token);

      login(resGoogle.data.user, resGoogle.data.token);

      showToast("Signed up successfully with Google!");
      navigate("/", { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      {/* Loading spinner overlay */}
      {loading && (<div className="loading-overlay"> <div className="spinner-border text-light" role="status"> <span className="visually-hidden">Loading...</span> </div> </div>
      )}

      {/* Signup Section */}
      <section className="signup-section container-md px-3 px-md-2 mb-5">
        <div className="signup-container">
          <div className="signup-heading">
            <h1 className="display-5 m-0 p-0">Sign Up</h1>
            <p className="fs-4 m-0 p-0 mt-3">Create your account and get started.</p>
          </div>

          <div className="signup-form p-4">
            <form className="row g-3" onSubmit={handleSubmit}>

              {/* Username input */}
              <div className="mb-1 col-12">
                <label htmlFor="username" className="form-label">Username:</label>
                <input type="text" className="form-control" id="username" value={formData.username} onChange={handleChange} placeholder='Enter username' required />
              </div>

              {/* Email input */}
              <div className="mb-1 col-12">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} placeholder='Enter email address' required />
              </div>

              {/* Password input */}
              <div className="mb-2 col-12">
                <label htmlFor="password" className="form-label">Password:</label>
                <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} placeholder='Enter password' required />
              </div>

              {/* Sign Up button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary fs-6">Sign Up</button>
              </div>

              {/* Link to Login page */}
              <div className="col-12 sign-up mt-4">
                <p className='m-0 p-0'>
                  Already have an account? <Link to="/login" className="link rounded-pill">Login</Link>
                </p>
              </div>

              <div className="col-12 text-center text-light mt-3">OR</div>

              {/* Google signup Button */}
              <div className="col-12">
                <button
                  type="button"
                  onClick={() => document.querySelector("div[role='button']").click()}
                  className="custom-google-btn"
                >
                  <svg className="google-icon" viewBox="0 0 24 24" >
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </button>
              </div>

              {/* Hidden Google Login Component */}
              <div style={{ display: "none" }}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => showToast("Google login failed")}
                />
              </div>
            </form>

          </div>
        </div>
      </section >

      {/* Toast notification */}
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

export default Sign_Up;