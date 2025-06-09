// src/components/SpendingDashboard.jsx
import React from 'react';

export default function SpendingDashboard({ selectedEmotion, detailList }) {
  return (
    <div style={{ padding: 24 }}>
      {/* 상세 내역 영역 */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          border: '1px solid #ddd',
          borderRadius: 4,
          background: '#fff',
        }}
      >
        {selectedEmotion ? (
          <>
            <h3 style={{ margin: '0 0 8px' }}>
              “{selectedEmotion}” 지출 상세
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {detailList.map(({ date, category, amount }, i) => (
                <li key={i} style={{ marginBottom: 4 }}>
                  {date} / {category} / ₩{amount.toLocaleString()}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p style={{ margin: 0, color: '#666' }}>
            파이 차트를 클릭하면 상세 내역이 여기에 표시됩니다.
          </p>
        )}
      </div>
    </div>
  );
}