import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChartMonthlySpending from '../components/ChartMonthlySpending';

export default function DateCategoryPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [spendingData, setSpendingData] = useState({});
  const todayStr = today.toLocaleDateString('sv-SE');
  const userId = localStorage.getItem('userId');

  // 달력 전체 그리드 크기 측정
  const calendarGridRef = useRef(null);
  const [calendarSize, setCalendarSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/chart/calendar?id=${userId}`);
        if (!res.ok) throw new Error('API 오류 발생');
        const data = await res.json();
        setSpendingData(data);
      } catch (err) {
        console.error('지출 데이터 가져오기 실패:', err);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    setSelectedDate(null);
  }, [year, month]);

  useEffect(() => {
    // 달력 그리드 렌더 후, 크기 측정하여 wrapper에 맞춤 (4px padding용)
    if (calendarGridRef.current) {
      setCalendarSize({
        width: calendarGridRef.current.offsetWidth + 4,    // +4px(2px씩) padding
        height: calendarGridRef.current.offsetHeight + 4,
      });
    }
  }, [year, month, spendingData]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (year, month) => new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDay(year, month);

  const getSpendingTotal = (dateStr) => {
    const data = spendingData[dateStr];
    if (!data) return 0;
    return data.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleCellClick = (dateStr) => {
    if (selectedDate === dateStr) setSelectedDate(null);
    else setSelectedDate(dateStr);
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
            onClick={() => handleCellClick(dateStr)}
            style={{
              ...cellStyle,
              border: isSelected ? '2.2px solid #278978' : '1px solid #ccc',
              backgroundColor: isSelected ? '#e0f7fa' : 'white',
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            <div style={{ position: 'absolute', top: 5, left: 5 }}>
              {isToday ? (
                <div style={{
                  backgroundColor: '#222',
                  color: 'white',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                }}>{day}</div>
              ) : (
                <span style={{ fontWeight: 'bold', fontSize: 17 }}>{day}</span>
              )}
            </div>
            <div style={{ marginTop: '38px', fontSize: '15px', color: '#278978', minHeight: 20 }}>
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
        <h3 style={{ fontSize: 16, marginBottom: 10 }}>{selectedDate} 지출 상세</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {spendingData[selectedDate].map((item, idx) => (
            <li key={idx} style={{ marginBottom: 4 }}>
              {item.category} - {item.amount.toLocaleString()}원 ({item.emotion})
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#faf7f0' }}>
      <div className="sidebar">
        <Sidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* 달력+상세 중앙 정렬, 간격 균일 */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginTop: 48,
          gap: 40,
        }}>
          {/* 달력 전체 wrapper */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* 연/월 선택 */}
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '22px'
            }}>
              <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ fontSize: 17, padding: '4px 14px' }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <option key={i} value={2022 + i}>{2022 + i}년</option>
                ))}
              </select>
              <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ fontSize: 17, padding: '4px 14px' }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{i + 1}월</option>
                ))}
              </select>
            </div>
            {/* 달력 겉 테두리: grid보다 4px씩 크게, 안에 grid 딱 맞게 */}
            <div
              style={{
                border: '2.4px solid #278978',
                borderRadius: '18px',
                background: 'white',
                padding: '0px',
                width: calendarSize.width ? calendarSize.width : undefined,
                height: calendarSize.height ? calendarSize.height : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'content-box',
                transition: 'width 0.3s, height 0.3s',
                overflow: 'visible',
              }}
            >
              <div ref={calendarGridRef} style={calendarGrid}>
                {renderCalendarCells()}
              </div>
            </div>
          </div>
          {/* 상세 정보 박스 (달력 옆에, flex 중앙 기준) */}
          {selectedDate &&
            <div style={{
              minWidth: 240,
              maxWidth: 320,
              background: '#fff',
              border: '1.5px solid #ccc',
              borderRadius: 10,
              padding: 18,
              marginTop: 24,
              height: 'fit-content',
              boxShadow: '0 2px 14px rgba(20,50,70,0.06)',
              display: 'flex',
              alignItems: 'flex-start',
            }}>
              {renderDetails()}
            </div>
          }
        </div>        {/* 하단: 월별 차트, 초록 테두리(딱 맞게 감쌈) */}
        <div style={{
          width: '97%',
          margin: '80px auto 0',
          border: '2.4px solid #278978',
          borderRadius: 22,
          boxSizing: 'border-box',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 0, // 추가!
        }}>
          <div style={{
            width: '100%',
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 2px 18px rgba(80,120,140,0.06)',
            minHeight: 320,
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 1,
            padding: 0, // 패딩 X
            margin: 0, // 마진 X
          }}>
            <ChartMonthlySpending userId={userId} height="320px" />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- 달력 셀 스타일
const cellStyle = {
  aspectRatio: '1 / 1',
  maxWidth: '98px',
  minHeight: '90px',
  boxSizing: 'border-box',
  border: '1px solid #ccc',
  padding: '5px',
  position: 'relative',
  background: '#fff',
  borderRadius: 10,
};

const calendarGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '9px',
};

const detailsBox = {
  background: '#fafafa',
  borderRadius: 8,
  border: '1.5px solid #278978',
  padding: '16px 14px',
};
