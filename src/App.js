import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";

import Register from "./pages/Registro";
import Alumno from "./pages/Alumno";
import PrivateRoute from "./components/PrivateRoute";

import AdminDashboard from "./pages/Admin";

function App() {
  return (
    <Router basename="/Frontend">
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Rutas protegidas */}
        <Route
          path="/Usuario"
          element={
            <PrivateRoute role="USUARIO">
              <Alumno />
            </PrivateRoute>
          }
        />
        
        <Route path="/Admin" 
        element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
