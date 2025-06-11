// src/components/ChartMonthlySpending.jsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchMonthlySpending } from '../api/spenterApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ChartMonthlySpending({ userId: propUserId, height = '500px' }) {
  const [chartData, setChartData] = useState({
    labels: [],       // → 나중에 1월~12월 세팅
    datasets: [{
      label: '₩ 지출 금액',
      data: [],       // → 나중에 12칸 채움
      fill: true,
      tension: 0.4,
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      pointRadius: 4,
    }],
  });

  useEffect(() => {
    const userId = propUserId || localStorage.getItem('userId');
    if (!userId) return;

    fetchMonthlySpending(userId)
      .then(rows => {
        // 1) labels: 1월~12월 고정
        const labels = Array.from({ length: 12 }, (_, i) => `${i+1}월`);
        // 2) 기본값 0으로 채운 12칸 배열
        const data = new Array(12).fill(0);

        // 3) rows 돌면서 month → 인덱스 → 금액 세팅
        //    rows 예시: [{ month: '2025-06', amount: 80000 }, …]
        rows.forEach(({ month, amount }) => {
          const mm = month.includes('-')
            ? month.split('-')[1]
            : month.padStart(2, '0');
          const idx = parseInt(mm, 10) - 1;
          if (idx >= 0 && idx < 12) {
            data[idx] = amount;  // 원 단위 그대로
          }
        });

        // 4) state 업데이트
        setChartData({
          labels,
          datasets: [{
            ...chartData.datasets[0],
            data,
          }],
        });
      })
      .catch(console.error);
  }, [propUserId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: '지난 12개월 월별 지출 추이',
        font: { size: 18 },
        padding: { bottom: 10 },
      },
      tooltip: {
        callbacks: {
          label: ctx => `₩ ${ctx.parsed.y.toLocaleString()}`
        }
      },
      legend: { display: false },
    },
    scales: {
      x: {
          offset: true,
        title: { display: true, text: '월' },
        ticks: { autoSkip: false, maxRotation: 0 },
      },
      y: {
        title: { display: true, text: '지출 (원)' },
        beginAtZero: true,
        ticks: {
          // 80000 → "8만"
          callback: v => `${(v/10000).toLocaleString()}만`
        }
      }
    }
  };

  return (
    <div style={{ width: '100%', height, overflow: 'hidden' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
