import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

// Component to protect admin pages, only allows access to admin user
const AdminGuard = ({ children }) => {
    // Gets current user and loading state from context
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    // if user is not admin, redirects to admin login page
    useEffect(() => {
        if (!loading) {
            if (!user || !user.isAdmin) {
                // Redirect only if not logged in or not admin
                navigate("/admin-login", { replace: true });
            }
        }
    }, [user, loading, navigate]);

    if (loading) return null; // Shows nothing while loading

    // If user is admin, allow access to the page
    return children;
};

export default AdminGuard;
