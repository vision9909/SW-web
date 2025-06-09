// src/components/AI_AnalyzeForm.jsx

import React, { useState } from 'react';
import '../pages/DashboardStyle.css';

export default function AI_AnalyzeForm({ userId }) {
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const response = await fetch('/api/ai-transaction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userId, // 예: "dkstjd3839"
                    text: text  // 예: "5일 전에 고기집에서 50000원짜리 식사를 했어요"
                })
            });

            const result = await response.json();
            if (!response.ok) {
                alert(`오류: ${result.error || '서버 오류'}`);
                return;
            }

            console.log('저장 완료:', result.data);
            alert('AI 분석 결과가 저장되었습니다.');

            // 입력창 초기화
            setText('');
        } catch (err) {
            console.error(err);
            alert('네트워크 오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='AI_inputTextContainer'>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="자세한 정보를 입력하세요."
                rows={3}
                className='AI_inputText' />
            <br></br>
            <button
                type="submit"
                className='AI_inputText_btn'>
                AI 분석 및 저장
            </button>
        </form>
    );
}
