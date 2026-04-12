import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--surface-color)',
          color: 'var(--text-color)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-color)',
        }
      }} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
