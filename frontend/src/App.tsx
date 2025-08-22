import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import FolderAccessPage from './pages/FolderAccessPage';
import FolderDashboardPage from './pages/FolderDashboardPage';
import AddEvidencePage from './pages/AddEvidencePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/folder-access/:folderId" element={<FolderAccessPage />} />
          <Route 
            path="/folder/:folderId" 
            element={
              <ProtectedRoute>
                <FolderDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/folder/:folderId/add-evidence" 
            element={
              <ProtectedRoute>
                <AddEvidencePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;