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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* ✅ 로그인 페이지가 메인 */}
        <Route path="/dashboard" element={<DashboardPage />} /> {/* ✅ 로그인 후 이동 */}
        <Route path="/emotion-category" element={<EmotionCategoryPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/date-category" element={<DateCategoryPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);