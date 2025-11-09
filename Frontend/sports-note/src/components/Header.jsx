import React, { useState } from "react";
import { BrowserRouter, Link } from 'react-router-dom';

// import Home from './Home';
// import Login from './Login';
// import Signup from './Sign-up';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <BrowserRouter>
            <>
                <header className="navbar navbar-expand-md container-md pt-4">
                    <nav className="navbar-nav w-100 d-flex flex-column flex-md-row justify-content-between text-center">

                        {/* Logo + Hamburger for mobile */}
                        <div className="d-flex justify-content-between align-items-center w-100 d-md-none">
                            <div className="Logo">
                                <Link to="/" className="text-white text-decoration-none fw-bold">SPORTS NOTE</Link>
                            </div>
                            <button
                                className="btn btn-transparent text-white border-2 border-white rounded-circle border-1"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <span className="fs-4">&#9776;</span> {/* Hamburger icon */}
                            </button>
                        </div>

                        {/* Desktop Logo */}
                        <div className="Logo d-none d-md-block">
                            <p className="m-0 p-0">
                                <Link to="/" className="text-decoration-none text-white">SPORTS NOTE</Link>
                            </p>
                        </div>

                        {/* Desktop Menu Links */}
                        <div className="menu-links d-none d-md-block">
                            <ul className="list-unstyled w-100 d-flex flex-md-row justify-content-between text-center text-decoration-none gap-4 m-0 p-0">
                                <li><Link to="/" className="text-decoration-none text-white">Moments</Link></li>
                                <li><Link to="/" className="text-decoration-none text-white">Fixtures</Link></li>
                                <li><Link to="/" className="text-decoration-none text-white">Quotes</Link></li>
                                <li><Link to="/" className="text-decoration-none text-white">Techniques</Link></li>
                                <li><Link to="/" className="text-decoration-none text-white">Sessions</Link></li>
                            </ul>
                        </div>

                        {/* Desktop Auth Links */}
                        <div className="auth-links d-none d-md-block">
                            <ul className="list-unstyled w-100 d-flex flex-md-row justify-content-between text-center gap-4 m-0 p-0">
                                <li><Link to="/" className="text-decoration-none text-white">Login</Link></li>
                                <li><Link to="/" className="text-decoration-none text-white">Sign Up</Link></li>
                            </ul>
                        </div>

                        {/* Mobile menu container */}
                        <div className={`d-md-none mobile-menu-container ${menuOpen ? "show" : ""}`}>
                            <ul className="menu-links list-unstyled m-0 p-0">
                                <li><Link to="/" className="text-white text-decoration-none">Moments</Link></li>
                                <li><Link to="/" className="text-white text-decoration-none">Fixtures</Link></li>
                                <li><Link to="/" className="text-white text-decoration-none">Quotes</Link></li>
                                <li><Link to="/" className="text-white text-decoration-none">Techniques</Link></li>
                                <li><Link to="/" className="text-white text-decoration-none">Sessions</Link></li>
                            </ul>
                            <ul className="auth-links list-unstyled m-0 p-0">
                                <li><Link to="/" className="text-white text-decoration-none">Login</Link></li>
                                <li><Link to="/" className="text-white text-decoration-none">Sign Up</Link></li>
                            </ul>
                        </div>

                    </nav>
                </header>

                {/* 
                <Routes>
                    <Route path="/" element={<Home />} />  
                    <Route path="/" element={<Login />} />  
                    <Route path="/" element={<Signup />} /> 
                </Routes> 
                */}
            </>
        </BrowserRouter>
    );
}

export default Header;
