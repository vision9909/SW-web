// src/App.jsx
// React-router-dom을 이용한 페이지 이동
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import EmotionCategoryPage from './pages/EmotionCategoryPage';
import DateCategoryPage from './pages/DateCategoryPage';
import FeedbackPage from './pages/FeedbackPage';
// 주소 직접 입력 방지(로그인 상태 후 접근 허용)
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
    // id
    const userIdFromStorage = localStorage.getItem('userId');

    {/* 거래내역을 대시보드에 볼 수 있게 하기 위함 */ }
    const [transactions, setTransactions] = useState([
        {
            id: 1,
            date: '2022-01-30',
            category: '교통/차량',
            detail: '버스비',
            amount: 12000,
            type: 'income',
        },
        {
            id: 2,
            date: '2022-01-30',
            category: '식비',
            detail: '외식비',
            amount: 4000,
            type: 'expense',
        },
    ]);

    return (
        <BrowserRouter> {/* 라우터 경로 */}
            <Routes>
                <Route path="/" element={<LoginPage />} /> {/* ✅ 로그인 페이지가 메인 */}
                <Route path="/register" element={<RegisterPage />} />  {/* ✅회원가입 페이지 */}
                {/* Transaction과 Dashboard의 경로 및 데이터 공유. */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage
                                userId={userIdFromStorage}
                                transactions={transactions}
                            />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <ProtectedRoute>
                            <TransactionsPage
                                transactions={transactions}
                                setTransactions={setTransactions}
                            />
                        </ProtectedRoute>
                    }
                />
                {/* 감정 카테고리 별 지출 라우터 */}
                <Route path="/emotion-category" element={
                    <ProtectedRoute>
                        <EmotionCategoryPage
                            userId={userIdFromStorage}
                            transactions={transactions}
                            />
                        </ProtectedRoute>
                } />

                {/* 날짜 별 지출 라우터 */}
                <Route path="/date-category" element={
                    <ProtectedRoute> <DateCategoryPage /> </ProtectedRoute>
                } />

                {/* 피드백 라우터 */}
                <Route path="/feedback" element={
                    <ProtectedRoute> <FeedbackPage /> </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

