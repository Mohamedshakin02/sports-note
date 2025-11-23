import React from "react";
import { Link } from "react-router-dom";

function Login() {

    return (
        <section className="login-section container-md px-3 px-md-2 ">
            <div className="login-container">
                <div className="login-heading">
                    <h1 className="display-5 m-0 p-0">Login</h1>
                    <p className="fs-4 m-0 p-0 mt-3">Sign in to access your account and continue.</p>
                </div>
                <div className="login-form p-4">

                    <form className="row g-3">
                        <div className="mb-1 col-12">
                            <label htmlFor="userID" className="form-label">User Name:</label>
                            <input type="text" className="form-control" id="userID"/>
                        </div>
                        <div className="mb-2 col-12">
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input type="email" className="form-control" id="password"/>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary fs-5">Login</button>
                        </div>

                        <div className="col-12 sign-up mt-4">
                            <p>Don't have an account? <Link to="/" className="link rounded-pill">Sign Up</Link></p>
                        </div>
                    </form>
                </div>
            </div>

            


        </section>
    );
}

export default Login