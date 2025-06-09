// src/components/SpendingContainer.jsx
import React, { useState } from 'react';
import ChartEmotion from './ChartEmotion';
import SpendingDashboard from './SpendingDashboard';

/**
 * 소비 대시보드 컨테이너
 * - ChartEmotion 클릭 시 상세 내역 표시
 */
export default function SpendingContainer({ userId, height = '400px' }) {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [detailList, setDetailList] = useState([]);

  // ChartEmotion 호출되는 콜백
  const handleEmotionSelect = (emotion, details) => {
    console.log('Emotion selected:', emotion, details);
    setSelectedEmotion(emotion);
    setDetailList(details);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* 감정별 파이 차트 */}
      <div style={{ width: '100%', height }}>
        <ChartEmotion
          userId={userId}
          onSelect={handleEmotionSelect}
          height="420px"
        />
      </div>

      {/* 클릭된 감정의 상세 내역 표시 */}
      <SpendingDashboard
        selectedEmotion={selectedEmotion}
        detailList={detailList}
      />
    </div>
  );
}
