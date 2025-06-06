// src/components/ChartEmotion.jsx
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

export default function ChartEmotion({ height = '85%' }) {
  // 1) 상태: 감정 라벨 목록, 각 감정별 합계 금액
  const [labels, setLabels] = useState([]);
  const [dataValues, setDataValues] = useState([]);

  useEffect(() => {
    // 2) localStorage에서 userId 꺼내기
    const userId = localStorage.getItem('userId');
    console.log('ChartEmotion → localStorage userId =', userId);

    if (!userId) {
      // 로그인 정보가 없으면 fetch를 수행하지 않음
      return;
    }

    // 3) 백엔드 API 호출
    fetch(`http://localhost:5000/api/chart/emotion?id=${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Emotion API 요청 실패 (status: ${res.status})`);
          }
          return res.json();
        })
        .then((json) => {
          console.log('ChartEmotion API 응답 →', json);
          // json 형식: [ { emotion: '기쁨', total: 16000 }, … ]
          const fetchedLabels = json.map((item) => item.emotion);
          const fetchedValues = json.map((item) => item.total);

          setLabels(fetchedLabels);
          setDataValues(fetchedValues);
        })
        .catch((err) => {
          console.error('ChartEmotion fetch error:', err);
        });
  }, []); // 마운트 시 한 번만 실행

  // 4) 차트에 넘겨줄 데이터 객체
  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#B0E0E6',
          '#A52A2A',
          '#7FFFD4',
          '#C71585',
          '#00FA9A',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 5) 차트 옵션
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        formatter: (value, context) => {
          const total = context.chart._metasets[0].total;
          return ((value / total) * 100).toFixed(1) + '%';
        },
        color: '#000',
      },
    },
  };

  return (
      <div style={{ width: '100%', height }}>
        {labels.length > 0 ? (
            <Pie data={data} options={options} />
        ) : (
            <p>감정별 지출 데이터를 불러오는 중입니다...</p>
        )}
      </div>
  );
}