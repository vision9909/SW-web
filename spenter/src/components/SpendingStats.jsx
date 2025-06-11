// src/components/SpendingStats.jsx
import React, { useEffect, useState } from 'react';
import ChartEmotion from './ChartEmotion';
import ChartCategory from './ChartCategory';

export default function SpendingStats({ userId }) {
  const [calendarData, setCalendarData] = useState({}); // { "2025-06-05": [ ... ], ... }
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // 1) 달력용 전체 데이터 로드
  useEffect(() => {
    fetch(`/api/chart/calendar?id=${userId}`)
      .then(r => r.json())
      .then(data => setCalendarData(data))
      .catch(console.error);
  }, [userId]);

  // 2) year, month 드롭다운 옵션
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 3) 선택된 년·월 데이터만 추출 → flatMap 으로 각 날짜의 배열 합치기
  const yyyy = year.toString();
  const mm = String(month).padStart(2, '0');
  const entries = Object.entries(calendarData)
    .filter(([date]) => date.startsWith(`${yyyy}-${mm}`))
    .flatMap(([, arr]) => arr);

  // 4a) 감정별 합계 계산
  const emotionMap = entries.reduce((acc, { emotion, amount }) => {
    acc[emotion] = (acc[emotion] || 0) + amount;
    return acc;
  }, {});
  const emotionData = Object.entries(emotionMap).map(
    ([emotion, total]) => ({ emotion, total })
  );

  // 4b) 카테고리별 합계 계산
  const categoryMap = entries.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryMap).map(
    ([category, total]) => ({ use_category: category, total })
  );

  return (
    <div>
      {/* 2) 년·월 셀렉터 */}
      <div style={{ marginBottom: 16 }}>
        <label>
          연도:&nbsp;
          <select value={year} onChange={e => setYear(+e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y}년</option>)}
          </select>
        </label>
        &nbsp;&nbsp;
        <label>
          월:&nbsp;
          <select value={month} onChange={e => setMonth(+e.target.value)}>
            {months.map(m => <option key={m} value={m}>{m}월</option>)}
          </select>
        </label>
      </div>

      {/* 5) 자식 컴포넌트에 계산된 데이터만 전달 */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <ChartEmotion data={emotionData} />
        </div>
        <div style={{ flex: 1 }}>
          <ChartCategory data={categoryData} />
        </div>
      </div>
    </div>
  );
}
