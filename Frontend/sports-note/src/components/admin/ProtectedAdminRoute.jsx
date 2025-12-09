// ProtectedAdminRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null; // optional spinner

    // If user not logged in, redirect to admin login
    if (!user) {
        return <Navigate to="/admin-login" replace state={{ from: location }} />;
    }

    // If user is logged in but not admin, redirects to not found page
    if (!user.isAdmin) {
        return <Navigate to="/not-found" replace />;
    }

    // Otherwise, allow access
    return children;
};

export default ProtectedAdminRoute;
