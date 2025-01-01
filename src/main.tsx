import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Navbar from './components/NavBar/NavBar.tsx';
import Login from './pages/Login/index.tsx';
import { ProtectedRoutes } from './components/ProtectedRoutes.tsx';
import AuthProvider from './hooks/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<App />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
