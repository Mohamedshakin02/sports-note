import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

function Login() {
  const navigate = useNavigate();
  const toastRef = useRef(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState({ message: "" });
  const [loading, setLoading] = useState(true);
  const [googleReady, setGoogleReady] = useState(false);

  const { login } = useContext(AuthContext);

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
      // const res = await axios.post("https://sports-note-backend.onrender.com/api/auth/login", formData, { withCredentials: true });

      const res = await axios.post(
        "https://sports-note-backend.onrender.com/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      showToast("Login successful!");

      // login(res.data.user); // store in context

      login(res.data.user, res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }


  };

  // Google login
  const handleGoogleLogin = async (response) => {
    if (!response.credential) return showToast("Google login failed");
    setLoading(true);
    try {
      // const res = await axios.post(
      //   "https://sports-note-backend.onrender.com/api/auth/google-login",
      //   { token: response.credential },
      //   { withCredentials: true }
      // );

      const res = await axios.post(
        "https://sports-note-backend.onrender.com/api/auth/google-login",
        { token: response.credential }
      );


      localStorage.setItem("token", res.data.token);


      // login(res.data.user); // store in context

      login(res.data.user, res.data.token);
      showToast("Logged in successfully with Google!");
      navigate("/", { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client?hl=en"; // force English
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        const signInContainer = document.getElementById("g_id_signin");
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
        setLoading(false);
        google.accounts.id.prompt();
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // clean up on unmount
    };
  }, []);

  return (
    <>
      {loading && (<div className="loading-overlay"> <div className="spinner-border text-light" role="status"> <span className="visually-hidden">Loading...</span> </div> </div>
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
                  placeholder="Enter email address"
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
                  placeholder="Enter password"
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

              {googleReady && (
                <>
                  <div className="text-center text-dark">OR</div>

                  <button
                    type="button"
                    className="google-button btn w-100"
                    onClick={() => {
                      google.accounts.id.prompt();
                    }}
                  >
                    <i className="bi bi-google me-2"></i> Sign in with Google
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section >

      {/* Toast */}
      < div className="toast-container position-fixed p-3" >
        <div ref={toastRef} className="toast custom-toast text-dark border-0" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-progress-wrapper">
            <div className="toast-progress"></div>
          </div>
        </div>
      </div >
    </>


  );
}

export default Login;