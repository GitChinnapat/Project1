import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import RegisterForm from './page/registerPage';
import LoginForm from './page/loginPage';
import Howtouse from './page/Howtouse';
import Moving from './page/Moving';
import Repair from './page/Repair';
import Repost from './page/Repost';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/Howtouse" element={<Howtouse/>} />
        <Route path="/Moving" element={<Moving/>} />
        <Route path="/Repair" element={<Repair/>} />
        <Route path="/Repost" element={<Repost/>} />
        <Route path="*" element={<Navigate to="/login" replace />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
