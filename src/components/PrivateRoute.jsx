import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token || !userRole) {
    return <Navigate to="/login" />;
  }

  // Permitir array de roles válidos o rol único
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
