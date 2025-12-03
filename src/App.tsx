import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import ModulesPage from './pages/ModulesPage';
import Module1 from './pages/modules/Module1';
import StudentDashboard from './pages/student/StudentDashboard';
import CourseCatalog from './pages/student/CourseCatalog';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseManager from './pages/admin/CourseManager';
import StudentManager from './pages/admin/StudentManager';

// Route Guards
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  return session ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isStaff, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  return session && isStaff ? <Layout>{children}</Layout> : <Navigate to="/student" />;
};

const AppRoutes = () => {
    const { session } = useAuth();
    return (
        <Routes>
          {/* Public Landing Page as Root */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/modules/modulo-1" element={<Module1 />} />
          
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/student" />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/student/catalog" element={<PrivateRoute><CourseCatalog /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><CourseManager /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><StudentManager /></AdminRoute>} />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;