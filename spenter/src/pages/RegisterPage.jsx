import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, username, password }),
      });

      const result = await res.json();

      if (res.status === 201) {
        setMessage('회원가입이 완료되었습니다!');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage(result.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', minWidth: '200px', backgroundColor: '#222', color: '#fff', padding: '20px' }}>
        <Sidebar />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
          <h2 style={{ textAlign: 'center' }}>회원가입</h2>
          <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} required />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">가입하기</button>
          {message && <div style={{ textAlign: 'center', color: 'red' }}>{message}</div>}
        </form>
      </div>
    </div>
  );
}
