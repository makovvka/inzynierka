import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  
  if (loading) {
    return <p className="text-center mt-20">Ładowanie...</p>;
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  if (role && user && user.role !== role) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        ❌ Brak uprawnień
      </div>
    );
  }

  return children;
}