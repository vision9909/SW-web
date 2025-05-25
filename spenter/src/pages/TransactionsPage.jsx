import Sidebar from '../components/Sidebar';

export default function TransactionsPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 고정 폭 사이드바 */}
      <div
        style={{
          width: '200px',
          minWidth: '200px',
          backgroundColor: '#222',
          color: '#fff',
          padding: '20px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <Sidebar />
      </div>

      <div
        style={{
          flex: 1,
          padding: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: '28px' }}>거래내역 페이지 (준비 중)</h2>
      </div>
    </div>
  );
}
