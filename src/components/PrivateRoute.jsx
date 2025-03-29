import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Si no hay token, el usuario no ha iniciado sesión
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si el rol del usuario no coincide con el rol esperado
  if (userRole !== role) {
    return <Navigate to="/login" />;
  }

  // Si pasa las validaciones, se permite el acceso a la ruta
  return children;
};

export default PrivateRoute;
