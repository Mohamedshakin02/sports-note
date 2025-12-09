import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const AdminGuard = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user || !user.isAdmin) {
                // Redirect only if not logged in or not admin
                navigate("/admin-login", { replace: true });
            }
        }
    }, [user, loading, navigate]);

    if (loading) return null; // optional loading spinner

    return children;
};

export default AdminGuard;
