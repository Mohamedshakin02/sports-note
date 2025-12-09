import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MomentsPage from './pages/MomentsPage';
import HomePage from './pages/HomePage';
import FixturesPage from './pages/FixturesPage';
import QuotesPage from './pages/QuotesPage';
import TechniquesPage from './pages/TechniquesPage';
import SessionsPage from './pages/SessionsPage';
import ScrollToTop from './components/layout/ScrollToTop';
import LoginPage from './pages/LoginPage';
import Sign_UpPage from './pages/Sign_UpPage';
import NotFound from './pages/NotFound';
import GuestRoute from "./components/auth/GuestRoute";
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import AdminLoginGuard from "./components/admin/AdminLoginGuard"; // NEW Route
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute"; // NEW Route

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/moments" element={<MomentsPage />} />
        <Route path="/fixtures" element={<FixturesPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/techniques" element={<TechniquesPage />} />
        <Route path="/sessions" element={<SessionsPage />} />

        {/* Regular User Auth Routes (Uses existing GuestRoute logic) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <GuestRoute>
              <Sign_UpPage />
            </GuestRoute>
          }
        />

        {/* Admin Login Route (Blocks REGULAR logged-in users) */}
        <Route
          path="/admin-login"
          element={
            <AdminLoginGuard>
              <AdminLoginPage />
            </AdminLoginGuard>
          }
        />

        {/* Admin Panel Route (Blocks ALL non-admin users, including guests) */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          } 
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App