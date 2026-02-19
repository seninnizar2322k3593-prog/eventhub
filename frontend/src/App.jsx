import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Components
import Header from './components/public/Header';
import Footer from './components/public/Footer';
import Home from './components/public/Home';
import EventList from './components/public/EventList';
import EventDetails from './components/public/EventDetails';
import ImageUpload from './components/public/ImageUpload';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import EventManagement from './components/admin/EventManagement';
import ImageManagement from './components/admin/ImageManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/upload" element={<ImageUpload />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute>
                    <EventManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/images"
                element={
                  <ProtectedRoute>
                    <ImageManagement />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
