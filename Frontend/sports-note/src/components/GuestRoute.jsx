import React from "react";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? <Navigate to="/not-found" replace /> : children;
};

export default GuestRoute;