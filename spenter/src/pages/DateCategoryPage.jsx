import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';


export default function DateCategoryPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [spendingData, setSpendingData] = useState({});
  const todayStr = today.toLocaleDateString('sv-SE');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('userId'); // 또는 'vision9909' 같은 고정 ID
        if (!id) return null; // 혹은 navigate('/')
        const res = await fetch(`/api/chart/calendar?id=${id}`);
        if (!res.ok) throw new Error('API 오류 발생');
        const data = await res.json();
        setSpendingData(data);
      } catch (err) {
        console.error('지출 데이터 가져오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const getSpendingTotal = (dateStr) => {
    const data = spendingData[dateStr];
    if (!data) return 0;
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  const renderCalendarCells = () => {
    const totalCells = startDay + daysInMonth;
    const cells = [];

    for (let i = 0; i < totalCells; i++) {
      if (i < startDay) {
        cells.push(<div key={`empty-${i}`} style={cellStyle}></div>);
      } else {
        const day = i - startDay + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const total = getSpendingTotal(dateStr);
        const isSelected = selectedDate === dateStr;

        cells.push(
          <div
            key={dateStr}
            onClick={() => setSelectedDate(dateStr)}
            style={{
              ...cellStyle,
              border: isSelected ? '2px solid #444' : '1px solid #ccc',
              backgroundColor: isSelected ? '#f0f0f0' : 'white',
              cursor: 'pointer',
            }}
          >
            <div style={{ position: 'absolute', top: 5, left: 5 }}>
              {isToday ? (
                <div style={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                }}>{day}</div>
              ) : (
                <span style={{ fontWeight: 'bold' }}>{day}</span>
              )}
            </div>
            <div style={{ marginTop: '30px', fontSize: '14px', color: '#555' }}>
              {total > 0 && `${total.toLocaleString()}원`}
            </div>
          </div>
        );
      }
    }

    return cells;
  };

  const renderDetails = () => {
    if (!selectedDate || !spendingData[selectedDate]) return null;

    return (
      <div style={detailsBox}>
        <h3>{selectedDate} 지출 상세</h3>
        <ul>
          {spendingData[selectedDate].map((item, idx) => (
            <li key={idx}>
              {item.category} - {item.amount.toLocaleString()}원 ({item.emotion})
            </li>
          ))}
        </ul>
      </div>
    );
  };


  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 사이드바 */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {/* 연/월 선택 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={2022 + i}>{2022 + i}년</option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{i + 1}월</option>
            ))}
          </select>
        </div>

        {/* 달력 틀 */}
        <div style={calendarWrapper}>
          <div style={calendarGrid}>
            {renderCalendarCells()}
          </div>
        </div>

        {/* 상세 박스 */}
        {renderDetails()}
      </div>
    </div>
  );
}

// ✅ 달력 셀 스타일 (정사각형)
const cellStyle = {
  aspectRatio: '1 / 1',
  maxWidth: '120px',
  minHeight: '80px',
  boxSizing: 'border-box',
  border: '1px solid #ccc',
  padding: '5px',
  position: 'relative',
};

// ✅ 달력 틀
const calendarWrapper = {
  maxWidth: '1000px',
  margin: '0 auto',
  border: '2px solid black',
  padding: '10px',
};

// ✅ 달력 그리드
const calendarGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '4px',
};

// ✅ 상세 정보 박스
const detailsBox = {
  maxWidth: '1000px',
  margin: '40px auto 0',
  border: '2px solid black',
  minHeight: '150px',
  padding: '20px',
  backgroundColor: '#fafafa',
};
