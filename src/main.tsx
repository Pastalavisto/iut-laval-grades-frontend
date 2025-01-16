import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Navbar from './components/NavBar/NavBar.tsx';
import Login from './pages/Login/index.tsx';
import { ProtectedRoutes } from './components/ProtectedRoutes.tsx';
import AuthProvider from './hooks/AuthProvider.tsx';
import Students from './pages/Students/index.tsx';
import { Toaster } from './components/ui/toaster.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Students />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
