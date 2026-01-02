import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheet/pages/not-found.css';

// Page for the 404 page/ Not Found route
function NotFound() {
  return (
    <div className="not-found container-md d-flex flex-column justify-content-center align-items-center text-center vh-100 px-3">
      <h1 className="display-3 mb-3 fw-bold">Goal Missed!</h1>
      <h2 className="fs-3 mb-4">Error 404: The content you were searching for went wide of the net.</h2>
      <p className="fs-5 mb-4">
        Don't let a minor error stop your momentum. Get back in the game!
      </p>

      {/* Button to navigate back to the homepage */}
      <Link 
        to="/" 
        className="btn text-decoration-none d-flex justify-content-center mt-1 mb-4 mb-lg-3 py-2 px-3 px-lg-4"
      >
        BACK TO HOME
      </Link>
    </div>
  )
}

export default NotFound