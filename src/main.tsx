import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import Navbar from './components/NavBar/NavBar.tsx';
import { ProtectedRoutes } from './components/ProtectedRoutes.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import AuthProvider from './hooks/AuthProvider.tsx';
import './index.css';
import Courses from './pages/Courses/index.tsx';
import Login from './pages/Login/index.tsx';
import Statistics from './pages/Statistics/index.tsx';
import StudentPage from './pages/StudentPage/index.tsx';
import Students from './pages/Students/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Toaster />
        <div className="container mx-auto p-4">
          <Routes>
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentPage />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
