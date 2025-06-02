// src/components/AI_AnalyzeForm.jsx

import React, { useState } from 'react';

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
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1rem' }}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="예: '5일 전에 고기집에서 25000원 정도 먹었어'"
                rows={4}
                style={{
                    // width: '100%',
                    // padding: '0.5rem',
                    // fontSize: '1rem',
                    // borderRadius: '4px',
                    // border: '1px solid #ccc',
                    // resize: 'vertical'
                }}
            />
            <button
                type="submit"
                style={{
                    // marginTop: '0.5rem',
                    // padding: '0.5rem 1rem',
                    // fontSize: '1rem',
                    // borderRadius: '4px',
                    // border: 'none',
                    // backgroundColor: '#007bff',
                    // color: '#fff',
                    // cursor: 'pointer'
                }}
            >
                AI 분석 및 저장
            </button>
        </form>
    );
}
