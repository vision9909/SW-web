// src/components/ChartCategory.jsx
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function ChartCategory({ height = '85%' }) {
  // 1) 전체 달력용 데이터 로드
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);

  // 2) 연/월 선택 state
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  // 드롭다운 옵션
  const yearOptions = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  // 캘린더 데이터 한 번만 가져오기
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    fetch(`http://localhost:5000/api/chart/calendar?id=${userId}`)
      .then(res => res.json())
      .then(json => setCalendarData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 3) 선택된 월의 카테고리별 합계 계산
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);

  useEffect(() => {
    if (loading) return;

    const mm = String(selectedMonth).padStart(2, '0');
    const prefix = `${selectedYear}-${mm}`; // "2025-06"

    // 해당 달 데이터만 추출 후 flat
    const entries = Object.entries(calendarData)
      .filter(([date]) => date.startsWith(prefix))
      .flatMap(([, arr]) => arr);

    // category별 합계
    const map = {};
    entries.forEach(({ category, amount }) => {
      map[category] = (map[category] || 0) + amount;
    });

    setLabels(Object.keys(map));
    setDataValues(Object.values(map));
  }, [calendarData, loading, selectedYear, selectedMonth]);

  // 4) 차트 데이터 & 옵션
  const data = {
    labels,
    datasets: [{
      data: dataValues,
      backgroundColor: [
        '#FFA500', '#9370DB', '#40E0D0', '#FF69B4',
        '#87CEFA', '#DA70D6', '#90EE90', '#FFC0CB',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'center',
        padding: 0,
        labels: {
          font: { size: 16 },
          padding: 4,
        }
      },
      datalabels: {
        color: '#fff',
        formatter: (value, ctx) => {
          const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return total ? `${((value / total) * 100).toFixed(1)}%` : '';
        }
      },
      tooltip: {
        callbacks: {
          label: ({ label, parsed }) => `${label}: ₩${parsed.toLocaleString()}`
        }
      },
    },
  };

  // 5) 렌더링
  return (
    <div style={{ width: '100%', height }}>
      {/* 연·월 선택 UI */}
      <div style={{ marginBottom: 8, textAlign: 'right' }}>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(+e.target.value)}
        >
          {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
        </select>
        &nbsp;
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(+e.target.value)}
        >
          {monthOptions.map(m =>
            <option key={m} value={m}>{m}월</option>
          )}
        </select>
      </div>

      {/* 차트 or 로딩/빈 상태 */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>데이터를 불러오는 중입니다…</p>
      ) : labels.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <p style={{ textAlign: 'center' }}>선택된 달에 지출 내역이 없습니다.</p>
      )}
    </div>
  );
}
