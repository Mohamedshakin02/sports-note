import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import NotFound from "../../pages/NotFound"; 

// Component to restrict pages for logged-in users (guest-only pages)
const GuestRoute = ({ children }) => {
  // Get current user info and loading state
  const { user, loading } = useContext(AuthContext);

  // While loading, shows nothing
  if (loading) return null; 

  // If user is logged in, block access to guest pages and shows 404
  if (user) return <NotFound />;

  // If no user is logged in, allow access to guest page
  return children;
};

export default GuestRoute;