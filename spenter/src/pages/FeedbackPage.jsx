import Sidebar from '../components/Sidebar';
import './Spenter.css';

export default function FeedbackPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 사이드바 */}
      <div className="sidebar">
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
        <h2 style={{ fontSize: '28px' }}>피드백 페이지 (준비 중)</h2>
      </div>
    </div>
  );
}
