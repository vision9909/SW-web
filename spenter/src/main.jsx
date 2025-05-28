// React-router-dom을 이용한 페이지 이동동
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import EmotionCategoryPage from './pages/EmotionCategoryPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import DateCategoryPage from './pages/DateCategoryPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import './index.css';

// 주소 직접 입력 방지(로그인 상태 후 접근 허용)
import ProtectedRoute from './components/ProtectedRoute.jsx'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* ✅ 로그인 페이지가 메인 */}
        <Route path="/register" element={<RegisterPage />} /> {/* ✅회원가입 페이지 */}
        <Route path="/dashboard" element={
          <ProtectedRoute> <DashboardPage /> </ProtectedRoute>
        } />     {/* ✅ 로그인 후 이동 */}
        <Route path="/emotion-category" element={
          <ProtectedRoute> <EmotionCategoryPage /> </ProtectedRoute>
        } />
        <Route path="/date-category" element={
          <ProtectedRoute> <DateCategoryPage /> </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute> <TransactionsPage /> </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute> <FeedbackPage /> </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);