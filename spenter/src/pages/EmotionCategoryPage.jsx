import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';
import './DashboardStyle.css';

export default function EmotionCategoryPage({userId}) {
    const navigate = useNavigate();

    // 로그인 체크
    useEffect(() => {
        if (!userId) navigate('/login');
    }, [userId, navigate]);

    // 선택된 감정 & 상세 내역 상태
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [detailList, setDetailList] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    // 감정 파이 차트 클릭 콜백
    const handleEmotionSelect = (emotion) => {
        setSelectedEmotion(emotion);
    };

    const handleDateChange = (newYear, newMonth) => {
        setYear(newYear);
        setMonth(newMonth);
        // 감정 선택 초기화하면, 상세도 리셋됩니다
        setSelectedEmotion(null);
        setDetailList([]);
    };

    // selectedEmotion, year, month가 바뀔 때마다 상세 내역 fetch
    useEffect(() => {
        if (!userId || !selectedEmotion) {
            setDetailList([]);
            return;
        }

        fetch(
            `/api/chart/emotion/detail`
            + `?id=${encodeURIComponent(userId)}`
            + `&emotion=${encodeURIComponent(selectedEmotion)}`
            + `&year=${year}&month=${month}`
        )
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(rows => {
                // rows: [ { date, use_place, credit }, … ]
                const details = rows.map(r => ({
                    // r.credit_date: "2025-04-01" (MySQL DATE → JS string)
                    date: r.date.split('T')[0],   // → "2025-04-01"
                    place:  r.use_place,
                    amount: r.credit
                }));
                setDetailList(details);
            })
            .catch(err => {
                console.error('상세 내역 로드 실패:', err);
                setDetailList([]);
            });
    }, [userId, selectedEmotion, year, month]);

    return (
        <div style={{display: 'flex', height: '100vh'}}>
            {/* 사이드바 */}
            <div className="sidebar">
                <Sidebar/>
            </div>

            {/* 메인 */}
            <div style={{
                flex: 2.2,
                padding: '20px 30px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                backgroundColor: '#F5E2C2',
                overflowX: 'hidden',
            }}>
                <h2 style={{margin: 0}}>감정/카테고리별 지출 통계</h2>

                {/* 상단 파이 차트 영역 */}
                <div style={{display: 'flex', gap: '40px', flex: 1}}>
                    {/* 감정별 */}
                    <div style={{
                        flex: '1 1 400px',
                        minWidth: '400px',
                        height: '520px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '15px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                    }}>
                        <h3 style={{textAlign: 'center', marginBottom: '10px'}}>
                            감정별 지출 비율
                        </h3>
                        <ChartEmotion
                            userId={userId}
                            year={year}
                            month={month}
                            onSelect={handleEmotionSelect}
                            onDateChange={handleDateChange}
                            height="420px"
                        />
                    </div>

                    {/* 카테고리별 */}
                    <div style={{
                        flex: '1 1 400px',
                        minWidth: '400px',
                        height: '520px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        padding: '15px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                    }}>
                        <h3 style={{textAlign: 'center', marginBottom: '10px'}}>
                            카테고리별 지출 비율
                        </h3>
                        <ChartCategory
                            userId={userId}
                            year={year}
                            month={month}
                            height="420px"
                        />
                    </div>
                </div>

                {/* 하단: 상세 내역 (고정 높이 & 스크롤) */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    height: '500px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    {selectedEmotion ? (
                        <>
                            <h3 style={{margin: '0 0 8px'}}>
                                “{selectedEmotion}” 지출 상세 ({year}년 {month}월)
                            </h3>
                            <ul style={{margin: 0, paddingLeft: 20}}>
                                {detailList.map(({date, place, amount}, i) => (
                                    <li key={i} style={{marginBottom: 4}}>
                                        {date} / {place} / ₩{amount.toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p style={{
                            margin: 0,
                            color: '#666',
                            textAlign: 'center'
                        }}>
                            감정별 파이 차트를 클릭하면 상세 내역이 여기에 표시됩니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}