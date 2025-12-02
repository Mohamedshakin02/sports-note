import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MomentsPage from './pages/MomentsPage';
import HomePage from './pages/HomePage';
import FixturesPage from './pages/FixturesPage';
import QuotesPage from './pages/QuotesPage';
import TechniquesPage from './pages/TechniquesPage';
import SessionsPage from './pages/SessionsPage';
import ScrollToTop from './components/ScrollToTop';
import LoginPage from './pages/LoginPage';
import Sign_UpPage from './pages/Sign_UpPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      
      <Routes>
        <Route path="/" element={<HomePage/>} />  
        <Route path="/moments" element={<MomentsPage/>} />
        <Route path="/fixtures" element={<FixturesPage/>} />
        <Route path="/quotes" element={<QuotesPage/>} />
        <Route path="/techniques" element={<TechniquesPage/>} />
        <Route path="/sessions" element={<SessionsPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/sign-up" element={<Sign_UpPage/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App