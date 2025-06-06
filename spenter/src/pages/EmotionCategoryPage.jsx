// src/pages/EmotionCategoryPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';
import './DashboardStyle.css'; // 전역 스타일(필요 시)
// import './EmotionCategoryPage.css'; // 페이지만을 위한 스타일(선택사항)

/**
 * EmotionCategoryPage
 *  - 왼쪽: DashboardPage 와 동일한 “사이드바 + 잔액/수입/지출 요약 박스”
 *  - 오른쪽: 감정별/카테고리별 파이 차트
 */
export default function EmotionCategoryPage({ transactions }) {
  const navigate = useNavigate();

  // ────────────────────────────────────────────────────
  // 1) 로그인 여부 체크: localStorage에 userId가 없으면 /login으로 리다이렉트
  // ────────────────────────────────────────────────────
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
    }
  }, [navigate]);

  // ────────────────────────────────────────────────────
  // 2) transactions를 이용해 “잔액/수입/지출” 계산
  //    - transactions prop이 없다면 빈 배열로 취급
  // ────────────────────────────────────────────────────
  const txns = transactions || [];
  const totalIncome = txns
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = txns
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* ── 우측 메인 콘텐츠(차트) 영역 ── */}
      <div
        style={{
          flex: 2.2,
          padding: '20px 30px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          backgroundColor: '#F5E2C2',
        }}
      >
        {/* 3) 위쪽: 뒤로 가기 버튼 + 페이지 제목 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>감정/카테고리별 지출 통계</h2>
        </div>

        {/* 4) 차트가 들어갈 영역 */}
        <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
          {/* 4-1) 감정별 지출 차트 */}
          <div
            style={{ flex: '1 1 400px', minWidth: '400px', height: '350px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>감정별 지출 비율</h3>
            <ChartEmotion height="280px" />
          </div>

          {/* 4-2) 카테고리별 지출 차트 */}
          <div
            style={{ flex: '1 1 400px', minWidth: '400px', height: '350px', backgroundColor: '#ffffff', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          >
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>카테고리별 지출 비율</h3>
            <ChartCategory height="280px" />
          </div>
        </div>
      </div>
    </div>
  );
}