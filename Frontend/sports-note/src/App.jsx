import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MomentsPage from './pages/MomentsPage';
import HomePage from './pages/HomePage';
import FixturesPage from './pages/FixturesPage';
import QuotesPage from './pages/QuotesPage';
import TechniquesPage from './pages/TechniquesPage';
import SessionsPage from './pages/SessionsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />  
        <Route path="/moments" element={<MomentsPage/>} />
        <Route path="/fixtures" element={<FixturesPage/>} />
        <Route path="/quotes" element={<QuotesPage/>} />
        <Route path="/techniques" element={<TechniquesPage/>} />
        <Route path="/sessions" element={<SessionsPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App