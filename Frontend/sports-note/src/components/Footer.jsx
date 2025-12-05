import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";


function Footer() {
    const { user, logout } = useContext(AuthContext);

    const capitalize = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1);
    };


    return (
        <footer className='py-5 pb-3 mt-1'>
            <div className='footer-container container-md px-3 px-md-2'>
                <div className='menu-links pe-5'>
                    <h1 className='h3 m-0 p-0'>Explore Sports Note</h1>
                    <p className='h5 m-0 p-0 pt-3'>Find everything you need to explore your sports notes.</p>
                    <ul className='list-unstyled m-0 p-0 pt-3 fs-4'>
                        <li className='pb-2'><Link to="/moments" className="text-decoration-none">Moments<span><i className="bi bi-arrow-up-right ms-1"></i></span></Link></li>
                        <li className='pb-2'><Link to="/fixtures" className="text-decoration-none">Fixtures<span><i className="bi bi-arrow-up-right ms-1"></i></span></Link></li>
                        <li className='pb-2'><Link to="/quotes" className="text-decoration-none">Quotes<span><i className="bi bi-arrow-up-right ms-1"></i></span></Link></li>
                        <li className='pb-2'><Link to="/techniques" className="text-decoration-none">Techniques<span><i className="bi bi-arrow-up-right ms-1"></i></span></Link></li>
                        <li className='pb-2'><Link to="/sessions" className="text-decoration-none">Sessions<span><i className="bi bi-arrow-up-right ms-1"></i></span></Link></li>
                    </ul>
                </div>

                <div className='auth-links ps-lg-5'>
                    {user ? (
                        <div className="d-flex flex-column m-0 p-0">
                            <h1 className='username h3 m-0 p-0 text-truncate overflow-hidden text-nowrap'>Hello, {capitalize(user.username)}</h1>
                            <p className='h5 m-0 p-0 pt-3 text-wrap'>Welcome back! Dive into your sports notes and make the most of all our features.</p>
                            <button
                                className="logout btn rounded-pill p-2 fs-5 mt-3 w-50"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <h1 className='h3 m-0 p-0'>Planning to organise your sports notes?</h1>
                            <p className='h5 m-0 p-0 pt-3'>Start building your sports collection by joining Sport Note.</p>
                            <ul className='list-unstyled m-0 p-0 mt-4'>
                                <li><Link to="/login" className="login text-decoration-none rounded-pill p-2 fs-5">Login</Link></li>
                                <li><Link to="/sign-up" className="sign text-decoration-none rounded-pill p-2 fs-5">Sign Up</Link></li>
                            </ul>
                        </>
                    )}
                </div>

                <div className='logo'>
                    <h2 className='display-4 m-0 p-0'>SPORTS <br />NOTE</h2>
                    <p className='m-0 p-0 pt-3 px-lg-5 fs-5'><i>Capture Plays, Track Progress, Relive Moments</i></p>
                </div>
            </div>

            <div className='copyright mt-5 mt-lg-3'>
                <p className='m-0 p-0'>&copy; 2025 SPORTS NOTE</p>
            </div>
        </footer>
    );
}

export default Footer;
