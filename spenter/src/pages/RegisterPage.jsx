import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [form, setForm] = useState({ id: '', userName: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '회원가입 실패');
      alert(data.message);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

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

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}
        >
          <h2 style={{ textAlign: 'center' }}>회원가입</h2>
          <input
            type="text"
            placeholder="ID"
            name="id"
            value={form.id}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Username"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">가입하기</button>

          {/* 에러 메시지를 폼 아래에 렌더링 */}
          {error && (
            <div style={{ textAlign: 'center', color: 'red' }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
