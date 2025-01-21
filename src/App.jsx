import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./component/dashboard/dashboard";
import Login from "./component/auth/login/loginPage";
import Register from "./component/auth/register/registerPage";
import ProtectedRoute from "./store/middleware/protectedRoute";
import AuthProvider from './context/authContext'; // Impor AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
