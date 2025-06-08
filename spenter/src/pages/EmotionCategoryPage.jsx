// src/pages/EmotionCategoryPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';
import ChartMonthlySpending from '../components/ChartMonthlySpending';
import './DashboardStyle.css';

export default function EmotionCategoryPage({ userId, transactions }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 왼쪽 사이드바 */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* 우측 메인 콘텐츠 */}
      <div
        style={{
          flex: 2.2,
          padding: '20px 30px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: '#F5E2C2',
          overflowX: 'hidden',
        }}
      >
        <h2 style={{ margin: 0 }}>감정/카테고리별 지출 통계</h2>

        {/* 상단: 감정별 & 카테고리별 파이 차트 */}
        <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
          <div style={{
            flex: '1 1 400px',
            minWidth: '400px',
            height: '500px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>감정별 지출 비율</h3>
            <ChartEmotion height="420px" />
          </div>
          <div style={{
            flex: '1 1 400px',
            minWidth: '400px',
            height: '500px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          }}>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>카테고리별 지출 비율</h3>
            <ChartCategory height="420px" />
          </div>
        </div>

        {/* 하단: 월별 지출 추이 차트 */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}>
          <ChartMonthlySpending height="580px" />
        </div>
      </div>
    </div>
  );
}
