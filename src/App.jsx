import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Ensure you have an AuthContext provider
import PrivateRoute from './routes/PrivateRoute'; // Your custom private route component
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages//Dashboard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <AuthProvider>

      <Navbar/>

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            {/* The Dashboard route is protected */}
            <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>                    
                  }/>            
            {/* Set Home as the default route */}
            <Route path="*" element={<Navigate to="/" />}  />
          </Routes>

      </AuthProvider>
    </Router>
  );
}

export default App;
