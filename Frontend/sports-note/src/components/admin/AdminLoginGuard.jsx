import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import NotFound from "../../pages/NotFound"; 

// Component to protect the admin login page from logged-in users
const AdminLoginGuard = ({ children }) => {
    // Gets current user and loading state from context
    const { user, loading } = useContext(AuthContext);

    if (loading) return null; // Show nothing while loading

    // If user is logged in
    if (user) {
        if (user.isAdmin) {
            // If user is admin, redirect from admin login to admin panel
            return <Navigate to="/admin" replace />;
        } else {
            // If regular user, show 404 page
            return <NotFound />;
        }
    }

    // If not logged in, allow access to admin login page
    return children;
};

export default AdminLoginGuard;
