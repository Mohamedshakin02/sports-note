import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MomentsPage from './pages/MomentsPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/moments" element={<MomentsPage/>} />
        <Route path="/" element={<HomePage/>} />  
      </Routes>
    </BrowserRouter>
  )
}

export default App