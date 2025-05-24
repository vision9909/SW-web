// src/App.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function Dashboard() {
    const salesRef = useRef(null);
    const userRef = useRef(null);

    useEffect(() => {
        if (salesRef.current) {
            new Chart(salesRef.current, {
                type: 'line',
                data: {
                    labels: ['1월', '2월', '3월'],
                    datasets: [{ label: '매출', data: [300, 400, 350] }]
                }
            });
        }
        if (userRef.current) {
            new Chart(userRef.current, {
                type: 'bar',
                data: {
                    labels: ['1월', '2월', '3월'],
                    datasets: [{ label: '신규 사용자', data: [50, 70, 65] }]
                }
            });
        }
    }, []);

    return (
        <div className="container">
            <header>내 대시보드</header>
            <aside>
                <nav>
                    <ul>
                        <li>메인화면</li>
                        <li>거래내역</li>
                        <li>피드백</li>
                        <li>캘린더</li>
                    </ul>
                </nav>
            </aside>
            <main>
                <div className="card">
                    <h3>월별 매출</h3>
                    <canvas ref={salesRef}></canvas>
                </div>
                <div className="card">
                    <h3>사용자 증가</h3>
                    <canvas ref={userRef}></canvas>
                </div>
            </main>
        </div>
    );
}