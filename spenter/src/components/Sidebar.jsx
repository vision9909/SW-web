import { Link, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaWallet, FaSmile, FaCalendarAlt, FaRobot } from 'react-icons/fa';

export default function Sidebar() {
  const username = localStorage.getItem('loggedInUsername');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUsername');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ margin: 0, fontSize: '40px'}}>Spenter</h2>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
        <Link to="/dashboard" style={linkStyle}><FaTachometerAlt style={iconStyle} /> 대시보드</Link>
        <Link to="/transactions" style={linkStyle}><FaWallet style={iconStyle} /> 거래내역</Link>
        <Link to="/emotion-category" style={linkStyle}><FaSmile style={iconStyle} /> 감정/카테고리 별 지출</Link>
        <Link to="/date-category" style={linkStyle}><FaCalendarAlt style={iconStyle} /> 날짜 별 지출</Link>
        <Link to="/feedback" style={linkStyle}><FaRobot style={iconStyle} /> 피드백</Link>
      </nav>

      {username && (
        <div style={{
          marginTop: 'auto',
          paddingTop: '20px',
          fontSize: '14px',
          color: '#ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{username}님 반갑습니다!</span>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: '10px',
              fontSize: '12px',
              padding: '4px 8px',
              cursor: 'pointer',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 'bold',
};

const iconStyle = {
  fontSize: '15px'
};
