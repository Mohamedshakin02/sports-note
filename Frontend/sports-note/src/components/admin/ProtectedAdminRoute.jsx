import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

// Component to protect admin page, ensures only admin users can access
const ProtectedAdminRoute = ({ children }) => {
    // Gets current user and loading state from context
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) return null; // Show nothing while loading

    // If user not logged in, redirects to admin login
    if (!user) {
        return <Navigate to="/admin-login" replace state={{ from: location }} />;
    }

    // If user is logged in but not admin, redirects to not found page
    if (!user.isAdmin) {
        return <Navigate to="/not-found" replace />;
    }

    // If user is admin, allow access to the page
    return children;
};

export default ProtectedAdminRoute;
