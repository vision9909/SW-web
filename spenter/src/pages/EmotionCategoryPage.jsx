import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';
import Sidebar from '../components/Sidebar';

export default function EmotionCategoryPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* 고정 사이드바 */}
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

      {/* 메인 콘텐츠 */}
      <div
        style={{
          flex: 1,
          padding: '40px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '60px',
            maxWidth: '1400px',
            width: '100%',
          }}
        >
          <div style={{ flex: '1 1 min(500px, 45%)', minWidth: '350px', height: 'auto' }}>
            <h2 style={{ textAlign: 'center' }}>감정별 지출</h2>
            <ChartEmotion height='400px'/>
          </div>
          <div style={{ flex: '1 1 min(500px, 45%)', minWidth: '350px', height: 'auto' }}>
            <h2 style={{ textAlign: 'center' }}>카테고리별 지출</h2>
            <ChartCategory height='400px'/>
          </div>
        </div>
      </div>
    </div>
  );
}
