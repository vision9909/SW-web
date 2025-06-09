import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../pages/DashboardStyle.css';

export default function Calendar({ userId }) {
    const navigate = useNavigate();

    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [spendingData, setSpendingData] = useState({});

    const holidays = [
        `${year}-01-01`, `${year}-03-01`, `${year}-05-05`,
        `${year}-06-06`, `${year}-08-15`, `${year}-10-03`,
        `${year}-10-09`, `${year}-12-25`
    ];

    // 서버 시간과 지출 데이터 한 번에 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 서버 시간
                // const timeRes = await fetch('/api/server-time');
                // const { now } = await timeRes.json();
                // const serverDate = new Date(now);
                // setYear(serverDate.getFullYear());
                // setMonth(serverDate.getMonth());

                const today = new Date();
                setYear(today.getFullYear());
                setMonth(today.getMonth());

                const id = userId || localStorage.getItem('userId');
                if (!id) {
                    console.warn('userId가 없습니다.');
                    return;
                }

                // 지출 데이터
                const dataRes = await fetch(`/api/chart/calendar?id=${id}`);
                const data = await dataRes.json();
                setSpendingData(data);
            } catch (err) {
                console.error('달력 초기화 실패', err);
            }
        };
        fetchData();
    }, [userId]);

    // 아직 연·월이 세팅되지 않았다면 로딩
    if (year === null || month === null) {
        return <div>달력 로딩 중...</div>;
    }

    // 한 달의 일수, 시작 요일 계산
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    // 오늘 날짜 표시용
    const todayStr = new Date().toLocaleDateString('sv-SE');

    // 연도만 변경하는 핸들러
    // 한 달 이전/이후 이동 핸들러
    const prevMonth = () => {
        if (month === 0) {
            setYear(y => y - 1);
            setMonth(11);
        } else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) {
            setYear(y => y + 1);
            setMonth(0);
        } else setMonth(m => m + 1);
    };

    const cells = [];
    const totalCells = startDay + daysInMonth;

    for (let i = 0; i < totalCells; i++) {
        if (i < startDay) {
            cells.push(<div key={`empty-${i}`} className='DateCategory_cell' />);
        } else {
            const day = i - startDay + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const total = (spendingData[dateStr] || []).reduce((sum, t) => sum + t.amount, 0);
            const isToday = dateStr === todayStr;
            const weekday = new Date(year, month, day).getDay();
            const isHoliday = weekday === 0 || holidays.includes(dateStr);

            // Holiday should override today styling
            const bgColor = isHoliday ? '#ffecec' : isToday ? '#f9f9f9' : '#fff';
            const textColor = isHoliday ? '#d32f2f' : isToday ? '#fff' : '#000';


            cells.push(
                <div
                    key={dateStr}
                    className='DateCategory_cell'
                    style={{
                        backgroundColor: bgColor
                    }}
                >
                    {/* 날짜 */}
                    <div className='DateCategory_day' style={{ color: textColor }}>
                        {isToday ? <div style={todayBadge}>{day}</div> : <strong>{day}</strong>}
                    </div>

                    {/* 지출 합계 (0 이상일 때만) */}
                    {total > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 5,
                                left: 5,
                                fontSize: 12,
                                color: '#000'
                            }}
                        >
                            {total.toLocaleString()}원
                        </div>
                    )}
                </div>
            );
        }
    }

    // 20년 전부터 20년 후까지 년도버튼 옵션 생성
    const startYear = year - 5;
    const endYear = year + 5;
    const yearOptions = [];
    for (let y = startYear; y <= endYear; y++) {
        yearOptions.push(
            <option key={y} value={y}>{y}년</option>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* 헤더: 이전 달, 연도 선택, 월 표시, 다음 달 */}
            <div className='DateCategory_header'>
                <div
                    className='DateCategory_title'
                    onClick={() => navigate('/date-category')}
                >Calendar</div>
                <div className='DateCategory_controls'>
                    <select
                        value={year}
                        onChange={e => setYear(+e.target.value)}
                        className='DateCategory_select'
                    >
                        {yearOptions}
                    </select>
                    <button onClick={prevMonth} className='DateCategory_btn'>&lt;</button>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{month + 1}월</div>
                    <button onClick={nextMonth} className='DateCategory_btn'>&gt;</button>
                </div>
            </div>

            {/* ① 요일 헤더 추가 */}
            <div className='DateCategory_Week'>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* 캘린더 그리드 */}
            <div style={calendarWrapper}>
                <div style={calendarGrid}>{cells}</div>
            </div>
        </div>
    );
}



const todayBadge = {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
};

const calendarWrapper = {
    width: '100%',
    height: '100%',
    overflow: 'auto',
};

const calendarGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
};
