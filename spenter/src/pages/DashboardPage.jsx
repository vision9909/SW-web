// src/App.jsx
import Sidebar from '../components/Sidebar';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

/*더미데이터*/
import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';

const boxStyle = {
    flex: 1,
    height: '100%',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
};



export default function DashboardPage() {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div
                style={{
                    width: '200px',
                    minWidth: '200px',
                    backgroundColor: '#222',
                    color: '#fff',
                    padding: '20px',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                }}>
                <Sidebar />
            </div>
            {/* 본문 */}
            <div
                style={{
                    flex: 1,
                    padding: '20px 30px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                }}
            >
                {/* 1행 */}
                <div style={{ display: 'flex', gap: '20px', height: '45%' }}>
                    <div style={{ flex: 2.5, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div
                            style={{
                                width: '30%', /* 영역을 30퍼내로 조정 */
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                color: '#333'
                            }}
                            onClick={() => navigate('/transactions')}
                        >
                            거래내역
                        </div>
                        <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                            <div style={boxStyle}>잔액</div>
                            <div style={boxStyle}>한 달 수입</div>
                            <div style={boxStyle}>한 달 지출</div>
                        </div>
                    </div>

                    {/* 감정별 지출 차트 */}
                    <div
                        style={{
                            flex: 1,
                            border: '1px solid #ccc',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            cursor: 'pointer',
                            padding: '10px',
                        }}
                        onClick={() => navigate('/emotion-category')}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>감정 별 지출</div>
                        <div style={{ width: '80%', height: '300px' }}>
                            <ChartEmotion />
                        </div>
                    </div>

                    {/* 카테고리별 지출 차트 */}
                    <div
                        style={{
                            flex: 1,
                            border: '1px solid #ccc',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            cursor: 'pointer',
                            padding: '10px',
                        }}
                        onClick={() => navigate('/emotion-category')}
                    >
                        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>카테고리 별 지출</div>
                        <div style={{ width: '80%', height: '300px' }}>
                            <ChartCategory />
                        </div>
                    </div>
                </div>

                {/* 2행: 달력 + AI 피드백 */}
                <div style={{ display: 'flex', gap: '20px', height: '50%' }}>
                    <div
                        style={{
                            flex: 1,
                            border: '1px solid #ccc',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/date-category')}
                    >
                        날짜 별 지출 (달력)
                    </div>
                    <div
                        style={{
                            flex: 1,
                            border: '1px solid #ccc',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/feedback')}
                    >
                        AI 피드백
                    </div>
                </div>
            </div>
        </div >
    );
}
