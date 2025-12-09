import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import moments from "../../assets/logos/moments-white.png";
import fixtures from "../../assets/logos/fixtures-white.png";
import quotes from "../../assets/logos/quotes-white.png";
import techniques from "../../assets/logos/techniques-white.png";
import sessions from "../../assets/logos/sessions-white.png";
import { AuthContext } from "../auth/AuthContext";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout, logoutLoading } = useContext(AuthContext);


    const capitalize = (name) => {
        if (!name) return "";
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    // Close dropdown if clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest(".auth-dropdown")) setDropdownOpen(false);
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const AuthDropdown = () => (
        <div className="auth-dropdown position-relative">
            <button
                className="dropbtn border-0 bg-transparent p-0"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                <i className="bi bi-person-fill text-white fs-3"></i>
            </button>

            {user ? (
                <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
                    <div className="username text-dark d-block fw-medium px-3 py-2 text-truncate overflow-hidden text-nowrap">
                        Hello, {capitalize(user.username)}
                    </div>

                    <button
                        onClick={logout}
                        className="logout text-dark text-center w-100 fw-medium px-3 py-2 border-0 bg-transparent"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className={`dropdown-content ${dropdownOpen ? "show" : ""}`}>
                    <Link to="/login" className="text-decoration-none d-block fw-medium px-3 py-2">
                        Login
                    </Link>
                    <Link to="/sign-up" className="text-decoration-none d-block fw-medium px-3 py-2">
                        Sign Up
                    </Link>
                    <Link to="/admin-login" className="text-decoration-none d-block fw-medium px-3 py-2">
                        Admin
                    </Link>

                </div>
            )}
        </div>
    );

    return (
        <header className="navbar navbar-expand-lg container-fluid py-4">

            {logoutLoading && (<div className="loading-overlay"> <div className="spinner-border text-light" role="status"> <span className="visually-hidden">Loading...</span> </div> </div>
      )}
      
            <nav className="container-md px-3 px-md-2 navbar-nav w-100 d-flex flex-column flex-md-row justify-content-between text-center">

                {/* Mobile Header */}
                <div className="d-flex justify-content-between align-items-center w-100 d-lg-none">
                    <div className="Logo">
                        <Link to="/" className="text-white text-decoration-none fw-bold">SPORTS NOTE</Link>
                    </div>

                    <div className="d-flex align-items-center gap-3">

                        {/* Mobile Menu Icon */}
                        <button
                            className="btn btn-transparent text-white p-0"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <i className="bi bi-grid-fill text-white fs-3"></i>
                        </button>

                        {/* Mobile Auth Dropdown */}
                        <AuthDropdown />
                    </div>
                </div>

                {/* Desktop Logo */}
                <div className="logo d-none d-lg-block">
                    <p className="m-0 p-0">
                        <Link to="/" className="text-decoration-none text-white fw-bold fs-4">SPORTS NOTE</Link>
                    </p>
                </div>

                {/* Desktop Menu */}
                <div className="menu-links d-none d-lg-flex align-items-center">
                    <ul className="list-unstyled nav nav-underline w-100 d-flex flex-md-row justify-content-between text-center gap-2 m-0 p-0 fs-6">
                        <li className="nav-item"><NavLink to="/moments" className="nav-link text-white fw-normal px-0">Moments</NavLink></li>
                        <li className="d-flex align-items-center"><hr className="line m-0 p-0 border-0" /></li>
                        <li className="nav-item"><NavLink to="/fixtures" className="nav-link text-white fw-normal px-0">Fixtures</NavLink></li>
                        <li className="d-flex align-items-center"><hr className="line m-0 p-0 border-0" /></li>
                        <li className="nav-item"><NavLink to="/quotes" className="nav-link text-white fw-normal px-0">Quotes</NavLink></li>
                        <li className="d-flex align-items-center"><hr className="line m-0 p-0 border-0" /></li>
                        <li className="nav-item"><NavLink to="/techniques" className="nav-link text-white fw-normal px-0">Techniques</NavLink></li>
                        <li className="d-flex align-items-center"><hr className="line m-0 p-0 border-0" /></li>
                        <li className="nav-item"><NavLink to="/sessions" className="nav-link text-white fw-normal px-0">Sessions</NavLink></li>
                    </ul>
                </div>

                {/* Desktop Auth Dropdown */}
                <div className="d-none d-lg-block">
                    <AuthDropdown />
                </div>

                {/* Mobile Slide Menu */}
                <div className={`mobile-sidenav ${menuOpen ? "open" : ""}`}>
                    <button className="closebtn" onClick={() => setMenuOpen(false)}>
                        <i className="bi bi-x-lg text-white fs-3"></i>
                    </button>

                    <ul className="list-unstyled mt-5 gap-3 mx-3">
                        <li><Link to="/moments" className="text-decoration-none text-white d-flex flex-column align-items-center justify-content-center h-100" onClick={() => setMenuOpen(false)}><img src={moments} alt="" className="mb-1" /><span>Moments</span></Link></li>
                        <li><Link to="/fixtures" className="text-decoration-none text-white d-flex flex-column align-items-center justify-content-center h-100" onClick={() => setMenuOpen(false)}><img src={fixtures} alt="" className="mb-1" /><span>Fixtures</span></Link></li>
                        <li><Link to="/quotes" className="text-decoration-none text-white d-flex flex-column align-items-center justify-content-center h-100" onClick={() => setMenuOpen(false)}><img src={quotes} alt="" className="mb-1" /><span>Quotes</span></Link></li>
                        <li><Link to="/techniques" className="text-decoration-none text-white d-flex flex-column align-items-center justify-content-center h-100" onClick={() => setMenuOpen(false)}><img src={techniques} alt="" className="mb-1" /><span>Techniques</span></Link></li>
                        <li><Link to="/sessions" className="text-decoration-none text-white d-flex flex-column align-items-center justify-content-center h-100" onClick={() => setMenuOpen(false)}><img src={sessions} alt="" className="mb-1" /><span>Sessions</span></Link></li>

                    </ul>
                </div>
            </nav>
        </header>

        
    );
}

export default Header;
