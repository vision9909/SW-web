// src/components/ChartEmotion.jsx
import React, { useEffect, useRef, useMemo, useState } from 'react';
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
                                         year,            // 부모로부터 받은 연도
                                         month,           // 부모로부터 받은 월
                                         onSelect,
                                         onDateChange,    // 연·월 변경 시 호출
                                         height = '420px'
                                     }) {
    const chartRef = useRef(null);
    const [calendarData, setCalendarData] = useState({});
    const [loading, setLoading] = useState(true);

    // 1) 전체 달력 데이터 로드
    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        fetch(`/api/chart/calendar?id=${encodeURIComponent(userId)}`)
            .then(res => res.json())
            .then(json => {
                setCalendarData(
                    json && typeof json === 'object' && !Array.isArray(json)
                        ? json
                        : {}
                );
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [userId]);

    // 2) 연·월 옵션
    const today = new Date();
    const years  = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // 3) summary 계산 (props.year, props.month 사용)
    const summary = useMemo(() => {
        if (loading) return [];
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        const entries = Object.entries(calendarData)
            .filter(([date]) => date.startsWith(prefix))
            .flatMap(([, arr]) => (Array.isArray(arr) ? arr : []));

        const totals = entries.reduce((acc, item) => {
            if (item.emotion && typeof item.amount === 'number') {
                acc[item.emotion] = (acc[item.emotion] || 0) + item.amount;
            }
            return acc;
        }, {});

        return Object.entries(totals).map(([emotion, total]) => ({ emotion, total }));
    }, [calendarData, loading, year, month]);

    // 4) 클릭 → 상세 계산 및 전달
    const handleClick = e => {
        const chart = chartRef.current;
        if (!chart) return;
        const pts = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, false);
        if (!pts.length) return;
        const idx = pts[0].index;
        const emotion = summary[idx]?.emotion;
        if (!emotion) return;

        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        const details = Object.entries(calendarData)
            .filter(([date]) => date.startsWith(prefix))
            .flatMap(([, arr]) => (Array.isArray(arr) ? arr : []))
            .filter(item => item.emotion === emotion)
            .map(item => ({
                date:   item.date,
                place:  item.use_place || '장소 없음',
                amount: item.amount,
                category: item.use_category || '카테고리 없음'
            }));

        onSelect && onSelect(emotion, details);
    };

    // 5) chart.js 데이터 & 옵션
    const data = {
        labels:   summary.map(d => d.emotion),
        datasets: [{
            data:           summary.map(d => d.total),
            backgroundColor:[
                '#FF6384','#36A2EB','#FFCE56','#B0E0E6','#A52A2A','#7FFFD4'
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
            {/* 연·월 선택 */}
            <div style={{ textAlign: 'right', marginBottom: 12 }}>
                <select
                    value={year}
                    onChange={e => onDateChange(+e.target.value, month)}
                    style={{ fontSize: 16, marginRight: 8 }}
                >
                    {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select
                    value={month}
                    onChange={e => onDateChange(year, +e.target.value)}
                    style={{ fontSize: 16 }}
                >
                    {months.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
            </div>

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