// AdminLoginGuard.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import NotFound from "../../pages/NotFound"; // import your NotFound page

const AdminLoginGuard = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return null; // optional spinner

    if (user) {
        if (user.isAdmin) {
            // Admin: allow login page redirect to admin panel
            return <Navigate to="/admin" replace />;
        } else {
            // Regular logged-in user: show 404
            return <NotFound />;
        }
    }

    // Not logged in: allow access to admin login
    return children;
};

export default AdminLoginGuard;
