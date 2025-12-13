import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import NotFound from "../../pages/NotFound"; // your styled 404 page

const GuestRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; 

  // If user is logged in, block guest pages
  if (user) return <NotFound />;

  // Otherwise allow guest access
  return children;
};

export default GuestRoute;