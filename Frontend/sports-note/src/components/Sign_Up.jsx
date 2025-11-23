import React from 'react'
import { Link } from "react-router-dom";

function Sign_Up() {
  return (
    <>
        <section className="signup-section container-md px-3 px-md-2 mb-5">
                    <div className="signup-container">
                        <div className="signup-heading">
                            <h1 className="display-5 m-0 p-0">Sign Up</h1>
                            <p className="fs-4 m-0 p-0 mt-3">Create your account and get started.</p>
                        </div>
                        <div className="signup-form p-4">
        
                            <form className="row g-3">
                                <div className="mb-1 col-12">
                                    <label htmlFor="userID" className="form-label">Username:</label>
                                    <input type="text" className="form-control" id="userID"/>
                                </div>
                                <div className="mb-1 col-12">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="email" className="form-control" id="email"/>
                                </div>
                                <div className="mb-2 col-12">
                                    <label htmlFor="password" className="form-label">Password:</label>
                                    <input type="email" className="form-control" id="password"/>
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
  )
}

export default Sign_Up