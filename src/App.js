import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ClassDetailsPage from './pages/ClassDetailsPage';
import StudentDashboard from './pages/StudentDashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/professor/class/:classId" element={<ClassDetailsPage />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
