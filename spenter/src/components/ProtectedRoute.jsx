// src/components/ProtectedRoute.jsx
// 주소 직접 입력방지
// 로그인 상태 확인 후 접근 허용 기능을 적용
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const username = localStorage.getItem('loggedInUsername');
    return username ? children : <Navigate to="/" />;
}