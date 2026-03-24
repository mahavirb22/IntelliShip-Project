import React from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../services/api";
import {
  clearAuthState,
  getAuthToken,
  isSellerUser,
} from "../services/authStorage";

const ProtectedRoute = ({ children, requireSeller = true }) => {
  const [checking, setChecking] = React.useState(true);
  const [isValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const runValidation = async () => {
      const token = getAuthToken();

      if (!token) {
        clearAuthState();
        setIsValid(false);
        setChecking(false);
        return;
      }

      try {
        await verifyToken();
        if (requireSeller && !isSellerUser()) {
          clearAuthState();
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch {
        clearAuthState();
        setIsValid(false);
      } finally {
        setChecking(false);
      }
    };

    runValidation();
  }, [requireSeller]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
