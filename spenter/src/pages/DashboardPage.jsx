// src/Dashboard.jsx
import Sidebar from '../components/Sidebar';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import AI_AnalyzeForm from '../components/AI_AnalyzeForm';
import './Spenter.css';

ChartJS.register(ArcElement, Tooltip, Legend);
/*더미데이터*/
import ChartEmotion from '../components/ChartEmotion';
import ChartCategory from '../components/ChartCategory';




export default function DashboardPage({ transactions, userId }) {
    const navigate = useNavigate();

    /* Transactions 잔액, 수입, 지출 계산 코드 */
    const totalIncome = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;


    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div className="sidebar">
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
                    backgroundColor: '#F5E2C2'
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
                            <div className="Transactions_box balance-box">
                                <h3>잔액</h3>
                                <p>{balance.toLocaleString()}원</p>
                            </div>
                            <div className="Transactions_box income-box">
                                <h3>수입</h3>
                                <p>{totalIncome.toLocaleString()}원</p>
                            </div>
                            <div className="Transactions_box expense-box">
                                <h3>지출</h3>
                                <p>{totalExpense.toLocaleString()}원</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: 1 }}>
                            {/* 유저가 직접 입력한 input-text */}
                            <div className="User_Transaction_box" style={{ width: '100%' }}>
                                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>AI 지출 분석</h2>
                                <AI_AnalyzeForm userId={userId} />
                            </div>
                        </div>
                    </div>
                    {/* 감정별 지출 차트 */}
                    <div className='EmotionCategory_container'>
                        <div style={{ marginBottom: '10px', }} onClick={() => navigate('/emotion-category')}>
                            감정 별 지출
                        </div>
                        <div style={{ width: '80%', height: '300px' }}>
                            <ChartEmotion />
                        </div>
                    </div>

                    {/* 카테고리별 지출 차트 */}
                    <div className='EmotionCategory_container'>
                        <div style={{ marginBottom: '10px' }} onClick={() => navigate('/emotion-category')}>
                            카테고리 별 지출
                        </div>
                        <div style={{ width: '80%', height: '300px' }}>
                            <ChartCategory />
                        </div>
                    </div>
                </div>

                {/* 2행: 달력 + AI 피드백 */}
                <div style={{ display: 'flex', gap: '20px', height: '50%' }}>
                    <div className='DateCategory_container' onClick={() => navigate('/date-category')}>
                        날짜 별 지출 (달력)
                    </div>
                    <div className='Feedback_container' onClick={() => navigate('/feedback')}>
                        AI 피드백
                    </div>
                </div>
            </div>
        </div >
    );
}
