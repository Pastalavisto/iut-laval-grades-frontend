import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Login from './pages/Login/index.tsx';
import { ProtectedRoute } from './components/ProtectedRoutes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute><App/></ProtectedRoute>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
