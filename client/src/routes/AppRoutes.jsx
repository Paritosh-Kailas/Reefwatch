import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import HomePage from '../pages/HomePage';
import DashboardPage from '../pages/DashboardPage';
import ReportsPage from '../pages/ReportsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports/density" element={<ReportsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
