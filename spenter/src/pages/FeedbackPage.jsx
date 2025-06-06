// src/pages/FeedbackPage.jsx
import Sidebar from '../components/Sidebar';
import './FeedbackStyle.css';

export default function FeedbackPage() {
  // 임시로 작은 박스를 10개 만들어 놓은 예시 배열
  const dummyItems = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    title: `피드백 항목 ${i + 1}`,
    description: `상세 설명 ${i + 1}`
  }));

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* 사이드바 */}
      <div className="sidebar">
        <Sidebar />
      </div>

      {/* 우측 메인 영역 */}
      <div className="feedback-container">
        {/* 위쪽 큰 네모(헤더 + 스크롤 되는 작은 네모 박스들) */}
        <div className="top-rect">
          <div className="top-header">
            피드백 항목
          </div>
          <div className="top-content">
            {dummyItems.map((item) => (
              <div key={item.id} className="small-rect">
                <div className="small-rect-title">{item.title}</div>
                <div className="small-rect-desc">{item.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 아래쪽 큰 네모(예: 상세 입력 영역 등) */}
        <div className="bottom-rect">
          {/* 여기에 실제 피드백 입력 또는 기타 내용을 넣으시면 됩니다. */}
          <p>하단 큰 박스(예: 상세 피드백 입력란)</p>
        </div>
      </div>
    </div>
  );
}