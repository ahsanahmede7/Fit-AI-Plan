import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import getAccessToken from "../tanstack/APIcall.js";

const ProtectedRoute = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = await getAccessToken();

      setToken(accessToken);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;