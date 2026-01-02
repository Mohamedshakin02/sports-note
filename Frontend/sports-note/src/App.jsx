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
import AdminLoginGuard from "./components/admin/AdminLoginGuard"; 
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute"; 

function App() {
  return (
    // BrowserRouter is used here to enable routing in react js (it will redirect the page without actually loading)
    <BrowserRouter>

      {/* ScrollToTop makes the page scroll to top whenever we navigate to a new route */}
      <ScrollToTop />

      {/* setting the paths for different pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/moments" element={<MomentsPage />} />
        <Route path="/fixtures" element={<FixturesPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/techniques" element={<TechniquesPage />} />
        <Route path="/sessions" element={<SessionsPage />} />

        {/* Login page and Sign Up page for users who are not logged in and
        those who are logged in cannot access Login page and Sign Up page */}
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

        {/* Admin Login page for users who are not logged in and
        those who are logged in cannot access admin login page*/}
        <Route
          path="/admin-login"
          element={
            <AdminLoginGuard>
              <AdminLoginPage />
            </AdminLoginGuard>
          }
        />

        {/* Admin dashboard page, only accessible to admin user not any other user / not logged in */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          } 
        />

        {/* Not Found Route , to display page for invalid URLs*/}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App