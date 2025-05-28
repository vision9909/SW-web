//src/components/Sidebar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaWallet, FaSmile, FaCalendarAlt, FaRobot } from 'react-icons/fa';
import '../pages/Spenter.css';

export default function Sidebar() {
  const userName = localStorage.getItem('loggedInUsername');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUsername');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ margin: 0, fontSize: '40px' }}>Spenter</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <Link to="/dashboard" className='linkStyle'><FaTachometerAlt className='iconStyle' /> 대시보드</Link>
        <Link to="/transactions" className='linkStyle'><FaWallet className='iconStyle' /> 거래내역</Link>
        <Link to="/emotion-category" className='linkStyle'><FaSmile className='iconStyle' /> 감정/카테고리 별 지출</Link>
        <Link to="/date-category" className='linkStyle'><FaCalendarAlt className='iconStyle' /> 날짜 별 지출</Link>
        <Link to="/feedback" className='linkStyle'><FaRobot className='iconStyle' /> 피드백</Link>
      </nav>

      {userName && (
        <div className='userName_logout'>
          <span style={{ whiteSpace: 'nowrap' }}> {/*← (선택) span 내부 줄바꿈도 금지*/}
            {userName} 님 반갑습니다!
          </span>
          
          <button
            onClick={handleLogout}
            className='logout_button'
          >
            로그아웃
          </button>
        </div>
      )
      }
    </div >
  );
}