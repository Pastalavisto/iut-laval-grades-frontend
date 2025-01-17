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
import Courses from './pages/Courses/index.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import StudentPage from './pages/StudentPage/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster />
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Students />} />
            <Route path="/courses" element={<Courses />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
