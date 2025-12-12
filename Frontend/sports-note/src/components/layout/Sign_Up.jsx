import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function Sign_Up() {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [toast, setToast] = useState({ message: "" });
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const { login } = useContext(AuthContext);

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

  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://sports-note-backend.onrender.com/api/auth/signup",
        formData,
        { withCredentials: true }
      );

      login(res.data.user);
      showToast("Signup successful!");
      setFormData({ username: "", email: "", password: "" });
      setTimeout(() => navigate("/", { replace: true }), 5);
      // window.location.replace("/");
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      showToast(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {

    if (!response.credential) return showToast("Google login failed");
    setLoading(true);
    try {
      const res = await axios.post("https://sports-note-backend.onrender.com/api/auth/google-login",
        { token: response.credential },
        { withCredentials: true }
      );

      login(res.data.user);
      showToast("Signed up successfully with Google!");
      setTimeout(() => navigate("/", { replace: true }), 5);
      // window.location.replace("/");
    } catch (err) {
      showToast(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /* global google */
    const signInContainer = document.getElementById("g_id_signin");
    if (!window.google || !signInContainer || signInContainer.childNodes.length > 0) return;


    google.accounts.id.initialize({
      client_id: "820918226908-3ovb2eiblurbg5h5ooiu0o9rco7r5cb4.apps.googleusercontent.com",
      callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(signInContainer, {
      theme: "outline",
      size: "large",
      width: "100%"
    });

    setGoogleReady(true);

    google.accounts.id.prompt();


  }, []);

  return (
    <>
      {loading && (<div className="loading-overlay"> <div className="spinner-border text-light" role="status"> <span className="visually-hidden">Loading...</span> </div> </div>
      )}


      <section className="signup-section container-md px-3 px-md-2 mb-5">
        <div className="signup-container">
          <div className="signup-heading">
            <h1 className="display-5 m-0 p-0">Sign Up</h1>
            <p className="fs-4 m-0 p-0 mt-3">Create your account and get started.</p>
          </div>

          <div className="signup-form p-4">
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="mb-1 col-12">
                <label htmlFor="username" className="form-label">Username:</label>
                <input type="text" className="form-control" id="username" value={formData.username} onChange={handleChange} placeholder='Enter username' required />
              </div>
              <div className="mb-1 col-12">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} placeholder='Enter email address' required />
              </div>
              <div className="mb-2 col-12">
                <label htmlFor="password" className="form-label">Password:</label>
                <input type="password" className="form-control" id="password" value={formData.password} onChange={handleChange} placeholder='Enter password' required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary fs-6">Sign Up</button>
              </div>

              <div className="col-12 sign-up mt-4">
                <p className='m-0 p-0'>
                  Already have an account? <Link to="/login" className="link rounded-pill">Login</Link>
                </p>
              </div>

              {googleReady && (
                <div className="text-center text-light">OR</div>
              )}

              <div id="g_id_signin"></div>
            </form>
          </div>
        </div>
      </section>

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
