import { HashRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Registro";
import Alumno from "./pages/Alumno";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import RequestPasswordReset from "./pages/RequestPasswordReset";  

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Request reset email */}
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />

        {/* Actual reset password page with token in URL */}
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/Usuario"
          element={
            <PrivateRoute role="USUARIO">
              <Alumno />
            </PrivateRoute>
          }
        />
        <Route
          path="/Admin"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
