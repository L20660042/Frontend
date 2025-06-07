import { HashRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Registro";
import Alumno from "./pages/Alumno";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ProfilePage from "./components/Profile"; // Página de perfil
import GestionarUsuarios from "./components/GestionarUsuarios"; // Pantalla de gestionar usuarios
import RegisterUser from "./components/Registro1"; // Pantalla de registrar usuario

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Ruta principal de bienvenida */}
        <Route path="/" element={<Welcome />} />

        {/* Rutas para login y registro */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Rutas de restablecimiento de contraseña */}
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas protegidas con rol USUARIO */}
        <Route
          path="/Usuario"
          element={
            <PrivateRoute role="USUARIO">
              <Alumno />
            </PrivateRoute>
          }
        />

        {/* Rutas protegidas con rol ADMIN */}
        <Route
          path="/Admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Rutas protegidas con rol ADMIN para gestionar usuarios */}
        <Route
          path="/admin/gestionar-usuarios"
          element={
            <PrivateRoute role="ADMIN">
              <GestionarUsuarios />
            </PrivateRoute>
          }
        />

        {/* Ruta para el perfil de usuario */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute role={["ADMIN", "USUARIO"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Ruta para registrar usuario */}
        <Route
          path="/admin/registrar-usuario"
          element={
            <PrivateRoute role="ADMIN">
              <RegisterUser onBack={() => window.history.back()} />
            </PrivateRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
