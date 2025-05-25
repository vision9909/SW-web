import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: pw }),
      });

      const result = await res.json();

      if (res.status === 200 && result.username) {
        localStorage.setItem('loggedInUsername', result.username);
        navigate('/dashboard');
      } else {
        setMessage(result.message || 'ID 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleLogin} style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ textAlign: 'center' }}>로그인</h2>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
        <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        <button type="submit">로그인</button>
        {message && <div style={{ textAlign: 'center', color: 'red' }}>{message}</div>}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <button type="button" style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
            ID/PW 찾기
          </button>
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
            onClick={() => navigate('/register')}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}
