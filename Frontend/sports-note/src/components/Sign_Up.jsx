import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

function Sign_Up() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        formData
      );

      console.log("Signup Success:", res.data);
      alert("Signup successful!");

    } catch (err) {
      console.error("Signup Error:", err.response?.data);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
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
                <input type="text" className="form-control" id="username"
                  value={formData.username} onChange={handleChange} />
              </div>

              <div className="mb-1 col-12">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" className="form-control" id="email"
                  value={formData.email} onChange={handleChange} />
              </div>

              <div className="mb-2 col-12">
                <label htmlFor="password" className="form-label">Password:</label>
                <input type="password" className="form-control" id="password"
                  value={formData.password} onChange={handleChange} />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary fs-5">Sign Up</button>
              </div>

              <div className="col-12 sign-up mt-4">
                <p className='m-0 p-0'>Already have an account? <Link to="/login" className="link rounded-pill">Login</Link></p>
              </div>
            </form>

          </div>
        </div>
      </section>
    </>
  );
}

export default Sign_Up;
