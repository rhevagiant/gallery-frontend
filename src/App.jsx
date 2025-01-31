import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./component/dashboard/dashboard";
import Login from "./component/auth/login/loginPage";
import Register from "./component/auth/register/registerPage";
import ProtectedRoute from "./store/middleware/protectedRoute";
import AuthProvider from './context/authContext'; // Import AuthProvider
import Sidebar from "./component/sidebar/sidebar"; // Import Sidebar
import AlbumList from "./component/album/albumList";
import PhotoList from "./component/photo/photoList";
import AlbumDetail from "./component/album/albumDetail"; // Import AlbumDetail
import Navbar from "./component/navbar/navbar";

const AppContent = () => {
  const location = useLocation();
  const sidebarRoutes = ["/", "/albums", "/photos"];

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      {/* Navbar selalu ditampilkan */}
      <Navbar />  

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Render Sidebar only for specified routes */}
        {sidebarRoutes.includes(location.pathname) && <Sidebar />}

        {/* Main Content */}
        <main style={{ flexGrow: 1, padding: '24px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/albums" element={
              <ProtectedRoute>
                <AlbumList />
              </ProtectedRoute>
            } />
            <Route path="/photos" element={ 
              <ProtectedRoute>
                <PhotoList />
              </ProtectedRoute>
            } />
            {/* Rute untuk halaman detail album */}
            <Route path="/album/:id" element={ 
              <ProtectedRoute>
                <AlbumDetail />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
