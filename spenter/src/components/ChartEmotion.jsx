// src/components/ChartEmotion.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function ChartEmotion({
  userId,
  onSelect,
  height = '420px'
}) {
  const chartRef = useRef(null);

  // 1) 전체 달력 데이터 한 번만 가져오기
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/chart/calendar?id=${encodeURIComponent(userId)}`)
      .then(res => res.json())
      .then(json => {
        // 서버 응답이 객체 형태인지 체크
        if (json && typeof json === 'object' && !Array.isArray(json)) {
          setCalendarData(json);
        } else {
          console.warn('calendar API 응답이 객체가 아닙니다:', json);
          setCalendarData({});
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  // 2) 연·월 선택 UI 상태
  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const years  = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 3) 선택된 연·월의 거래만 뽑아서 감정별 합계(summary) 계산
  const summary = useMemo(() => {
    if (loading) return [];
    const prefix = `${year}-${String(month).padStart(2,'0')}`;
    const entries = Object.entries(calendarData);
    if (!entries.length) return [];

    const items = entries
      .filter(([date]) => date.startsWith(prefix))
      .flatMap(([, arr]) => Array.isArray(arr) ? arr : []);

    const map = {};
    items.forEach(item => {
      if (item.emotion && typeof item.amount === 'number') {
        map[item.emotion] = (map[item.emotion] || 0) + item.amount;
      }
    });

    return Object.entries(map).map(([emotion, total]) => ({ emotion, total }));
  }, [calendarData, loading, year, month]);

  // 4) Pie 클릭 시 상세 뽑아서 onSelect 호출
  const handleClick = e => {
    const chart = chartRef.current;
    if (!chart) return;
    const pts = chart.getElementsAtEventForMode(
      e, 'nearest', { intersect: true }, false
    );
    if (!pts.length) return;

    const idx = pts[0].index;
    const emotion = summary[idx]?.emotion;
    if (!emotion) return;

    const prefix = `${year}-${String(month).padStart(2,'0')}`;
    const entries = Object.entries(calendarData);
    const details = entries
      .filter(([date]) => date.startsWith(prefix))
      .flatMap(([, arr]) => Array.isArray(arr) ? arr : [])
      .filter(item => item.emotion === emotion)
      .map(item => ({
        date:   item.date,
        place:  item.use_place || '장소 없음',
        amount: item.amount
      }));

    onSelect && onSelect(emotion, details);
  };

  // 5) Pie 데이터 & 옵션
  const data = {
    labels:   summary.map(d => d.emotion),
    datasets: [{
      data:           summary.map(d => d.total),
      backgroundColor:[
        '#FF6384','#36A2EB','#FFCE56',
        '#B0E0E6','#A52A2A','#7FFFD4'
      ],
      borderWidth:    1
    }]
  };

  const options = {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text:    '감정별 지출 비율',
        align:   'center',
        font:    { size: 22 },
        padding: { bottom: 12 }
      },
      legend: {
        position: 'top',
        align:    'center',
        labels:   { font: { size: 18 }, padding: 8 }
      },
      datalabels: {
        color: 'white',
        font:  { weight: 'bold', size: 14 },
        formatter: (value, ctx) => {
          const arr   = ctx.chart.data.datasets[0].data;
          const total = arr.reduce((a,b) => a + b, 0);
          return total ? `${((value/total)*100).toFixed(1)}%` : '';
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.label}: ₩${ctx.parsed.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height }}>
      {/* 연·월 선택 드롭다운 */}
      <div style={{ textAlign: 'right', marginBottom: 12 }}>
        <select
          value={year}
          onChange={e => setYear(+e.target.value)}
          style={{ fontSize: 16, marginRight: 8 }}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}년</option>
          ))}
        </select>
        <select
          value={month}
          onChange={e => setMonth(+e.target.value)}
          style={{ fontSize: 16 }}
        >
          {months.map(m => (
            <option key={m} value={m}>{m}월</option>
          ))}
        </select>
      </div>

      {/* 로딩 / 차트 / 빈 상태 */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>데이터 불러오는 중…</p>
      ) : summary.length > 0 ? (
        <Pie
          key={`${year}-${month}`}
          ref={chartRef}
          data={data}
          options={options}
          onClick={handleClick}
          redraw
        />
      ) : (
        <p style={{ textAlign: 'center' }}>
          {year}년 {month}월에 지출 내역이 없습니다.
        </p>
      )}
    </div>
  );
}
